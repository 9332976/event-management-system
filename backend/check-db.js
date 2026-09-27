import 'dotenv/config';
import net from 'node:net';
import tls from 'node:tls';
import dns from 'node:dns/promises';
import mongoose from 'mongoose';

const maskUri = (uri = '') => uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');

const line = (label, value) => console.log(`  ${label.padEnd(22)} ${value}`);

const tlsReach = (host, port) =>
  new Promise((resolve) => {
    const plain = net.connect({ host, port });
    const done = (result) => {
      plain.destroy();
      resolve(result);
    };
    plain.setTimeout(15000);

    plain.on('connect', () => {
      const s = tls.connect({ socket: plain, servername: host, rejectUnauthorized: false }, () => {
        const cert = s.getPeerCertificate();
        done({
          ok: true,
          subject: cert?.subject?.CN || '(none)',
          issuer: cert?.issuer?.O || '(none)',
          validTo: cert?.valid_to || '(unknown)',
        });
      });
      s.on('error', (e) => done({ ok: false, reason: `TLS error: ${e.code || e.message}` }));
      s.on('timeout', () => done({ ok: false, reason: 'TLS handshake timed out (no certificate offered)' }));
    });

    plain.on('timeout', () => done({ ok: false, reason: 'TCP timeout' }));
    plain.on('error', (e) => done({ ok: false, reason: `TCP error: ${e.code || e.message}` }));
  });

const run = async () => {
  console.log('\n=== CampusConnect database diagnostic ===\n');

  const uri = process.env.MONGODB_URI || '';
  console.log('[1] Environment');
  line('MONGODB_URI', uri ? maskUri(uri) : 'MISSING');
  line('PORT', process.env.PORT || '5000 (default)');
  line('JWT_SECRET', process.env.JWT_SECRET ? 'set' : 'MISSING');
  line('CLIENT_URL', process.env.CLIENT_URL || 'MISSING');

  if (!uri) {
    console.log('\nFix: set MONGODB_URI in backend/.env\n');
    process.exit(1);
  }

  const isSrv = uri.startsWith('mongodb+srv://');
  const parseHosts = (value) => {
    const afterScheme = value.replace(/^mongodb(\+srv)?:\/\//, '');
    const authority = afterScheme.split('/')[0];
    const hostPart = authority.includes('@') ? authority.split('@').pop() : authority;
    return hostPart.split(',').map((h) => {
      const [hostname, port = '27017'] = h.split(':');
      return `${hostname}:${port}`;
    });
  };
  const srvName = uri.replace(/^mongodb\+srv:\/\//, '').split('/')[0].split('@').pop();
  const hosts = isSrv
    ? await dns
        .resolveSrv(`_mongodb._tcp.${srvName}`)
        .then((r) => r.map((x) => `${x.name}:${x.port}`))
        .catch((e) => [`SRV lookup failed: ${e.code || e.message}`])
    : parseHosts(uri);

  console.log('\n[2] Connection style');
  line('URI type', isSrv ? 'SRV (mongodb+srv://)' : 'seed list (mongodb://)');
  if (isSrv && String(hosts[0]).startsWith('SRV lookup failed')) {
    console.log('\n  PROBLEM: your network DNS refuses SRV lookups.');
    console.log('  FIX A (no admin): use the seed-list form in .env instead.');
    console.log('  FIX B (admin):  set adapter DNS to 1.1.1.1 / 8.8.8.8');
  }

  console.log('\n[3] Hosts resolved');
  for (const h of hosts) console.log(`  ${h}`);

  console.log('\n[4] Network reachability to the first host');
  const usesTls = isSrv || /[?&](ssl|tls)=true/.test(uri);
  const [firstHost, firstPort] = String(hosts[0]).split(':');
  if (!usesTls) {
    line('tls', 'not required (plain local connection)');
  } else {
    const probe = await tlsReach(firstHost, Number(firstPort || 27017));
    if (!probe.ok) {
      console.log(`  ${probe.reason}`);
      console.log('\n  A failure here means the host is unreachable: wrong hostname,');
      console.log('  the cluster is paused, this IP is not in the Atlas access list,');
      console.log('  or the network blocks outbound 27017.');
    } else {
      line('tcp + tls', 'reachable');
      line('certificate CN', probe.subject);
      line('issued by', probe.issuer);
      console.log('\n  The host answered, so the network path and the IP access list are OK.');
      console.log('  If step 5 fails, the cause is the URI itself (wrong replicaSet,');
      console.log('  wrong database user, or wrong password), not connectivity.');
    }
  }

  console.log('\n[5] Mongoose connect');
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 20000 });
    const collections = await conn.connection.db.listCollections().toArray();
    line('status', 'CONNECTED');
    line('database', conn.connection.name);
    line('collections', collections.map((c) => c.name).join(', ') || '(none yet)');
    line('users count', await conn.connection.db.collection('users').countDocuments());

    const hello = await conn.connection.db.admin().command({ hello: 1 });
    line('replica set', hello.setName || '(standalone)');
    line('primary available', String(hello.isWritablePrimary ?? hello.ismaster));
    const currentSet = (uri.match(/replicaSet=([^&]+)/) || [])[1];
    if (currentSet && hello.setName && currentSet !== hello.setName) {
      console.log(`\n  PROBLEM: .env replicaSet=${currentSet} does not match the cluster's ${hello.setName}.`);
      console.log(`  FIX: set replicaSet=${hello.setName} in MONGODB_URI`);
    }

    await mongoose.disconnect();
    console.log('\n=== All good. Start the backend with: npm run dev ===\n');
    process.exit(0);
  } catch (error) {
    line('status', 'FAILED');
    line('error', error.name);
    line('message', error.message.split('\n')[0]);
    console.log('\n  If step 4 said "reachable", connectivity is fine and the URI is the');
    console.log('  problem. The usual cause is a wrong replicaSet value: run check:db once');
    console.log('  with the replicaSet parameter removed to learn the real set name, then');
    console.log('  put that exact value back into MONGODB_URI.');
    console.log('\n  If step 4 failed, check Atlas > Network Access > IP Access List for the');
    console.log('  project that owns this cluster, and confirm the cluster is not paused.');
    console.log('\n=== Re-run this check after every Atlas change: npm run check:db ===\n');
    process.exit(1);
  }
};

run();
