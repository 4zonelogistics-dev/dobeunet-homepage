import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LegalDocumentLayoutProps {
  readonly title: string;
  readonly lastUpdated: string;
  readonly children: ReactNode;
}

export default function LegalDocumentLayout({ title, lastUpdated, children }: LegalDocumentLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 mb-8 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded px-2 py-1"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 sm:p-12">
          <header className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Last Updated: <time dateTime={lastUpdated}>{new Date(lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            </p>
          </header>

          <article className="prose prose-slate dark:prose-invert max-w-none">
            {children}
          </article>
        </div>
      </div>
    </div>
  );
}
