import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  message: string;
  action?: ReactNode;
}

export default function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="state-card empty-state">
      <strong>{title}</strong>
      <p>{message}</p>
      {action}
    </div>
  );
}
