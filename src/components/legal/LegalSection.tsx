import { ReactNode } from 'react';

interface LegalSectionProps {
  readonly id: string;
  readonly title: string;
  readonly children: ReactNode;
  readonly level?: 2 | 3;
}

export default function LegalSection({ id, title, children, level = 2 }: LegalSectionProps) {
  const HeadingTag = `h${level}` as const;

  const headingClasses = level === 2
    ? "text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4 scroll-mt-24"
    : "text-xl font-semibold text-slate-800 dark:text-slate-100 mt-6 mb-3 scroll-mt-24";

  return (
    <section id={id} className="mb-8">
      <HeadingTag className={headingClasses}>
        <a href={`#${id}`} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
          {title}
        </a>
      </HeadingTag>
      <div className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
}
