import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onCTAClick: () => void;
}

export default function Hero({ onCTAClick }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden" aria-labelledby="hero-heading">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzFmMjkzNyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.3] mb-6">
              Stop Losing Money to{' '}
              <span className="text-cyan-400">Operational Blind Spots</span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-300 mb-8 leading-[1.6]">
              Purpose-built software for mid-market businesses ready to eliminate waste, ensure compliance, and scale profitably
            </p>

            <button
              onClick={onCTAClick}
              className="group inline-flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
            >
              Schedule Free Operations Audit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="mt-6 text-sm text-slate-400">
              No sales pitch - just actionable insights for your operations
            </p>
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                <div className="space-y-6">
                  <div className="bg-slate-900/80 rounded-lg p-6 border border-slate-700">
                    <h3 className="text-lg font-semibold mb-3 text-cyan-400">Restaurant Operations</h3>
                    <div className="space-y-2 text-sm text-slate-300">
                      <div className="flex justify-between">
                        <span>Food Waste Reduction</span>
                        <span className="font-bold text-green-400">30%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time Saved Monthly</span>
                        <span className="font-bold text-green-400">100+ hrs</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ROI Timeline</span>
                        <span className="font-bold text-green-400">2-3 months</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 rounded-lg p-6 border border-slate-700">
                    <h3 className="text-lg font-semibold mb-3 text-blue-400">Fleet Compliance</h3>
                    <div className="space-y-2 text-sm text-slate-300">
                      <div className="flex justify-between">
                        <span>Centralized Documentation</span>
                        <span className="font-bold text-green-400">✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compliance Templates</span>
                        <span className="font-bold text-green-400">✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Single-Person Management</span>
                        <span className="font-bold text-green-400">✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
