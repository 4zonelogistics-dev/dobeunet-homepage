import { CheckCircle2, TrendingDown, Clock, DollarSign, Target, Shield, FileText, Users, Zap } from 'lucide-react';

export default function Solutions() {
  return (
    <section id="solutions" className="py-20 bg-slate-50 dark:bg-slate-800" aria-labelledby="solutions-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="solutions-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-[1.3]">
            Software Built for Your Reality
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-[1.6]">
            Specialized solutions for mid-market operators who need more than basic tools but can't justify enterprise pricing
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-6">
              <h3 className="text-2xl font-bold text-white mb-2 leading-[1.3]">
                Restaurant Operations Platform
              </h3>
              <p className="text-cyan-50">
                For multi-location restaurants (5-50 locations)
              </p>
            </div>

            <div className="p-8 dark:bg-slate-900">
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1 leading-[1.4]" style={{ letterSpacing: '0.015em' }}>
                      30% food waste reduction in 60 days
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Real-time tracking identifies waste patterns you didn't know existed
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1 leading-[1.4]" style={{ letterSpacing: '0.015em' }}>
                      100+ hours saved monthly on operations
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Automated invoice processing and cross-location visibility
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1 leading-[1.4]" style={{ letterSpacing: '0.015em' }}>
                      2-3 month ROI with $20-50K annual savings per location
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Fast payback from waste reduction and efficiency gains
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <h5 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-600" />
                  Key Features
                </h5>
                <ul className="space-y-2">
                  {[
                    'Food waste tracking & analytics',
                    'Automated AP invoice processing',
                    'Cross-location performance dashboards',
                    'Vendor management & ordering',
                    'Real-time cost monitoring'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <h3 className="text-2xl font-bold text-white mb-2 leading-[1.3]">
                Fleet Compliance Platform
              </h3>
              <p className="text-blue-50">
                For mid-size fleets (25-75 vehicles)
              </p>
            </div>

            <div className="p-8 dark:bg-slate-900">
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1 leading-[1.4]" style={{ letterSpacing: '0.015em' }}>
                      Centralized DVIR, training, and incident documentation
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Everything in one place for instant audit readiness
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1 leading-[1.4]" style={{ letterSpacing: '0.015em' }}>
                      Customizable curriculum with compliance templates
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Pre-built training modules based on DOT requirements
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1 leading-[1.4]" style={{ letterSpacing: '0.015em' }}>
                      Single-person fleet management for 25-75 vehicle operations
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Designed for operators without dedicated safety staff
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <h5 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Key Features
                </h5>
                <ul className="space-y-2">
                  {[
                    'Digital DVIR management',
                    'Driver training curriculum & tracking',
                    'Incident & accident documentation',
                    'DOT compliance checklists',
                    'Safety performance analytics'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
