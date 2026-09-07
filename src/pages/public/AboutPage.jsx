import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Trophy, Users, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutPage = () => {
  const stats = [
    { label: 'Campus Events Hosted', value: '120+' },
    { label: 'Enrolled Student Members', value: '2,500+' },
    { label: 'Faculty & Club Conveners', value: '50+' },
    { label: 'Active Student Societies', value: '35+' },
  ];

  const values = [
    {
      title: 'Universal Inclusivity',
      desc: 'Ensuring every student, from first-year fresher to final-year researcher, has equal discovery access to co-curricular events.',
      icon: Users,
    },
    {
      title: 'Effortless Club Operations',
      desc: 'Empowering campus organizers with instantaneous digital check-ins, dynamic registration passes, and real-time attendance rosters.',
      icon: Trophy,
    },
    {
      title: 'Trust & Campus Safety',
      desc: 'Verified university organizers, authentic certificates, and clear administrative oversight from the Deanery of Student Affairs.',
      icon: Shield,
    },
  ];

  return (
    <div className="pb-24 space-y-20">
      
      {/* Hero */}
      <section className="pt-12 pb-16 bg-gradient-to-b from-indigo-50/60 to-transparent dark:from-slate-900/60 dark:to-transparent">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Campus Mission</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white leading-tight">
            Empowering Campus Life Through Seamless Connection.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            CampusConnect is the unified platform modernizing event discovery, collegiate hackathons, sports tournaments, and club activities for the entire university.
          </p>
        </div>
      </section>

      {/* Numbers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft text-center space-y-2"
            >
              <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-indigo-600 dark:text-indigo-400">
                {s.value}
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Why CampusConnect Exists
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white mt-1">
            Built by Students, Designed for Excellence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div
                key={idx}
                className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4 hover:border-indigo-300 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {v.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display">
            Ready to dive into the next big campus event?
          </h2>
          <p className="text-indigo-100 text-sm max-w-xl mx-auto">
            Discover hackathons, debates, cultural fests, and workshops happening this week.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 hover:bg-slate-100 rounded-xl font-bold text-sm shadow-md transition-all"
          >
            <span>Explore Campus Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
};
