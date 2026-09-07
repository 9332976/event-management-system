import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Send, Heart, ArrowUp } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid college email address', 'error');
      return;
    }
    showToast('Subscribed to Campus Weekly Event Digest!', 'success');
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1 & 2: Branding & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-2xl text-white tracking-tight">
                Campus<span className="text-indigo-400">Connect</span>
              </span>
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Discover. Participate. Connect. Making campus life vibrant, structured, and universally accessible for students, club organizers, and university faculty.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="pt-2 max-w-sm">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Subscribe to Campus Digest
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter student email..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center shrink-0 shadow-sm"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/events" className="hover:text-indigo-400 transition-colors">
                  All Events
                </Link>
              </li>
              <li>
                <Link to="/events?category=hackathon" className="hover:text-indigo-400 transition-colors">
                  Hackathons
                </Link>
              </li>
              <li>
                <Link to="/events?category=cultural" className="hover:text-indigo-400 transition-colors">
                  Cultural Fests
                </Link>
              </li>
              <li>
                <Link to="/events?category=workshop" className="hover:text-indigo-400 transition-colors">
                  Tech Workshops
                </Link>
              </li>
              <li>
                <Link to="/events?category=sports" className="hover:text-indigo-400 transition-colors">
                  Sports Tournaments
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/student/dashboard" className="hover:text-indigo-400 transition-colors">
                  Student Hub
                </Link>
              </li>
              <li>
                <Link to="/organizer/dashboard" className="hover:text-indigo-400 transition-colors">
                  Organizer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/organizer/create-event" className="hover:text-indigo-400 transition-colors">
                  Host an Event
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-indigo-400 transition-colors">
                  Admin Console
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition-colors">
                  About CampusConnect
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Help & Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition-colors">
                  Contact Helpdesk
                </Link>
              </li>
              <li>
                <Link to="/contact#faq" className="hover:text-indigo-400 transition-colors">
                  Campus FAQs
                </Link>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); showToast('Student Privacy Policy: Demo mode', 'info'); }} className="hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); showToast('Campus Guidelines & Terms: Demo mode', 'info'); }} className="hover:text-indigo-400 transition-colors">
                  Event Guidelines
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span>© 2026 CampusConnect. All rights reserved. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5 inline" />
            <span>for collegiate life.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400">Version 2.4 (Frontend Edition)</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5"
              title="Back to top"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
