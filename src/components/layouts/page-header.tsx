import type { ReactNode } from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  backLink?: Route;
}

export function PageHeader({ title, description, actions, backLink }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        {backLink && (
          <Link
            href={backLink}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        )}
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
