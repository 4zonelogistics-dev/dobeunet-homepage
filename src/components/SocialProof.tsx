import { MapPin, Users, TrendingUp } from 'lucide-react';

export default function SocialProof() {
  return (
    <section id="social-proof" className="py-20 bg-white dark:bg-slate-900" aria-labelledby="social-proof-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="social-proof-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-[1.3]">
            Building with Real Operators
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-[1.6]">
            Currently in pilot programs with mid-market businesses who understand the gap we're filling
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-8 border border-cyan-100 dark:border-cyan-800">
            <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 leading-[1.3]">
              Restaurant Pilots
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              Currently in pilot with Ocean County restaurant groups refining real-world operational workflows
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-100 dark:border-blue-800">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 leading-[1.3]">
              Fleet Development
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              Developing with mid-Atlantic fleet operators who manage 25-75 vehicles without dedicated safety teams
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8 border border-slate-200 dark:border-slate-600">
            <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 leading-[1.3]">
              Local Focus
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              Based in Neptune, NJ - prioritizing businesses within 100 miles for hands-on partnership
            </p>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 sm:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-[1.3]">
            Why Mid-Market Operators Choose Us
          </h3>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            We're not trying to be everything to everyone. We focus exclusively on the operational challenges faced by businesses caught between basic tools and enterprise solutions they can't justify.
          </p>
        </div>
      </div>
    </section>
  );
}
