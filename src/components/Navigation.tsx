import { useState } from 'react';
import { ArrowRight, Menu, X, Briefcase, Target, Users, Mail } from 'lucide-react';
import { CompactThemeToggle } from './ThemeToggle';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setMobileMenuOpen(false);
    }
  };

  const handleScheduleMeeting = () => {
    window.open('https://app.apollo.io/#/meet/jeremyw/letsmeet', '_blank', 'noopener,noreferrer');
    setMobileMenuOpen(false);
  };

  const navigationLinks = [
    { label: 'Solutions', icon: Target, action: () => scrollToSection('solutions') },
    { label: 'Industries', icon: Briefcase, action: () => scrollToSection('industries') },
    { label: 'Success Stories', icon: Users, action: () => scrollToSection('social-proof') },
    { label: 'Contact', icon: Mail, action: () => scrollToSection('contact') },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <a href="/" className="focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 rounded-lg" aria-label="Dobeu Tech Solutions - Home">
              <img
                src="/2025-10-11- Dobeu Logo (Logo with Text)whtiebck.png"
                alt="Dobeu Tech Solutions"
                className="h-10 sm:h-12 lg:h-14 w-auto dark:brightness-0 dark:invert transition-all"
              />
            </a>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {navigationLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 rounded-lg px-2 py-1"
                aria-label={link.label}
              >
                <link.icon className="w-4 h-4" aria-hidden="true" />
                <span>{link.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <CompactThemeToggle className="hidden sm:flex" />

            <button
              onClick={handleScheduleMeeting}
              className="group inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-400 dark:hover:bg-cyan-500 text-white dark:text-slate-900 font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              aria-label="Schedule a meeting"
            >
              <span className="hidden sm:inline">Schedule Meeting</span>
              <span className="sm:hidden">Meet</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          role="menu"
          aria-label="Mobile navigation"
        >
          <div className="px-4 py-4 space-y-2">
            {navigationLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="flex items-center gap-3 w-full text-left px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                role="menuitem"
              >
                <link.icon className="w-5 h-5" aria-hidden="true" />
                <span>{link.label}</span>
              </button>
            ))}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <CompactThemeToggle className="flex sm:hidden px-4 py-3" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
