import { MapPin, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-slate-950 dark:bg-slate-950 text-slate-300 mt-20 pt-2" role="contentinfo" aria-label="Site footer">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div>
            <img
              src="/2025-10-11- Dobeu Logo (Logo with Text)whtiebck.png"
              alt="Dobeu Tech Solutions"
              className="h-10 mb-4 brightness-0 invert"
            />
            <p className="text-slate-400 text-sm leading-relaxed">
              Specialized software for mid-market operations. Built for businesses caught between basic tools and enterprise solutions.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm">Neptune, NJ</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <a href="mailto:info@dobeu.net" className="text-sm hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded px-1 py-0.5" aria-label="Email us at info@dobeu.net">
                  info@dobeu.net
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Available via scheduled consultation</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Service Area</h4>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Currently prioritizing businesses within 100 miles of Neptune, NJ for pilot program participation and hands-on partnership.
            </p>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-2">Pilot Programs Active</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Ocean County Restaurants</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Mid-Atlantic Fleets</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Dobeu Tech Solutions. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="text-sm text-slate-400 hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded px-2 py-1"
              >
                Privacy Policy
              </Link>
              <Link
                to="/tos"
                className="text-sm text-slate-400 hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded px-2 py-1"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
