import { TrendingDown, Clock, BarChart3, AlertTriangle, FileText, ShieldAlert } from 'lucide-react';

export default function Problems() {
  return (
    <section id="industries" className="py-20 bg-white dark:bg-slate-900" aria-labelledby="problems-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="problems-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-[1.3]">
            Sound Familiar?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-[1.6]">
            You're caught between basic tools that don't scale and enterprise solutions you can't justify
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-cyan-100 dark:border-cyan-800">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 leading-[1.3]">
              <span className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center text-white" aria-hidden="true">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
              For Restaurant Operators
            </h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1 leading-[1.4]" style={{ letterSpacing: '0.015em' }}>
                    Losing $200-300 weekly per location to untracked food waste?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Without real-time visibility, you're throwing away profits you can't even measure
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1 leading-[1.4]" style={{ letterSpacing: '0.015em' }}>
                    Spending 13+ hours on manual invoice processing?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Time your team could spend improving operations instead of chasing paperwork
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1 leading-[1.4]" style={{ letterSpacing: '0.015em' }}>
                    Can't see performance gaps across locations?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Flying blind without cross-location visibility means missing optimization opportunities
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 leading-[1.3]">
              <span className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white" aria-hidden="true">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </span>
              For Fleet Operators
            </h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1 leading-[1.4]" style={{ letterSpacing: '0.015em' }}>
                    One safety violation away from a $15K+ DOT penalty?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Compliance gaps you don't even know exist could shut down your operation
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1 leading-[1.4]" style={{ letterSpacing: '0.015em' }}>
                    Drowning in DVIR paperwork and training documentation?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Scattered files across multiple systems make audits a nightmare
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1 leading-[1.4]" style={{ letterSpacing: '0.015em' }}>
                    Can't justify a full-time safety manager but need compliance coverage?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    You're stuck doing it yourself or risking costly violations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
