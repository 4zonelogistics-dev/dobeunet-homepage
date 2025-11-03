import { Calendar, Users, ArrowRight } from 'lucide-react';

interface CTAProps {
  onStrategyClick: () => void;
  onPilotClick: () => void;
}

export default function CTA({ onStrategyClick, onPilotClick }: CTAProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" aria-labelledby="cta-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-[1.3]">
            Ready to Stop the Profit Leak?
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-[1.6]">
            Let's quantify exactly where your operations are losing money - and how to fix it
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <button
            onClick={onStrategyClick}
            className="group bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 rounded-2xl p-8 text-left transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-cyan-500/50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <ArrowRight className="w-6 h-6 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3 leading-[1.3]">
              Book Strategy Session
            </h3>

            <p className="text-cyan-50 mb-6 leading-relaxed">
              30-minute operational profit recovery session. Get a custom profit leak analysis with quantified savings potential and 90-day implementation roadmap.
            </p>

            <div className="space-y-2 text-sm text-cyan-50">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <span>Calculate your actual waste and inefficiency costs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <span>Identify quick wins with measurable impact</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <span>Get realistic ROI projections for your operation</span>
              </div>
            </div>
          </button>

          <button
            onClick={onPilotClick}
            className="group bg-slate-800 hover:bg-slate-750 border-2 border-slate-700 hover:border-cyan-500 rounded-2xl p-8 text-left transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-cyan-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-cyan-500/30">
                <Users className="w-7 h-7 text-cyan-400" />
              </div>
              <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3 leading-[1.3]">
              Join Pilot Program
            </h3>

            <p className="text-slate-300 mb-6 leading-relaxed">
              Get early access to our platform with hands-on support. Shape the product while solving your operational challenges at pilot pricing.
            </p>

            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                <span>Preferential pricing for pilot participants</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                <span>Direct input on feature development</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                <span>Priority support from our team</span>
              </div>
            </div>
          </button>
        </div>

        <p className="text-center text-slate-400 mt-8 text-sm">
          Currently prioritizing businesses within 100 miles of Neptune, NJ
        </p>
      </div>
    </section>
  );
}
