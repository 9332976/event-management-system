import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ContactPage = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    department: 'Student Affairs',
    message: ''
  });
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How do I register for an event?',
      a: 'Browse the Events page, click on any event to view its details, and click "Register Now". Your verified digital pass with QR code will be generated instantly and stored under "My Registrations".'
    },
    {
      q: 'Can I cancel my registration if I cannot attend?',
      a: 'Yes! Navigate to Student Dashboard > My Registrations, find the event, and click "Cancel Registration". The seat is automatically returned to the public pool for other students.'
    },
    {
      q: 'How do student clubs get permission to host an event?',
      a: 'Club conveners and faculty advisors log in with the Organizer role, fill out the "Create Event" form, and submit it for Deanery moderation.'
    },
    {
      q: 'Do I need to print my digital ticket pass?',
      a: 'No, you can simply display the digital ticket QR pass on your mobile phone screen at the venue entrance for automated check-in.'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    showToast('Your inquiry has been submitted to the Student Affairs desk!', 'success');
    setFormData({
      name: '',
      email: '',
      subject: '',
      department: 'Student Affairs',
      message: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
          Contact & Campus Helpdesk
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Have questions about event guidelines, venue bookings, or ticketing? We are here to help.
        </p>
      </div>

      {/* Grid: Contact Form & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Campus Event Coordination Office
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Central Campus Office</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Student Activity Center (SAC), Room 204, Main University Campus
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Email Inquiries</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    events.support@campus.edu
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Helpdesk Hotline</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    +91 (011) 2659-8800 (Ext. 204)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div className="p-6 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-2">
            <h4 className="font-bold text-indigo-950 dark:text-indigo-200">
              Desk Timings
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Monday to Friday: 09:00 AM – 05:30 PM <br />
              Saturday (Event Days): 08:30 AM – 07:00 PM
            </p>
          </div>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Send a Message
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Debjit Roy"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  College Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@campus.edu"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Question regarding InnovateX Hackathon Pass"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Message *
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your query or feedback in detail..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Inquiry</span>
            </button>
          </form>
        </div>

      </div>

      {/* FAQ Accordion */}
      <div id="faq" className="space-y-6 max-w-4xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Got Questions?
          </span>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>

              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
