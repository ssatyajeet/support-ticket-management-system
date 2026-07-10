import { cn } from '../../lib/cn';

type ErrorAlertProps = {
  message: string;
};

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-2xl border border-red-200/80 bg-red-50/90 px-4 py-3.5',
        'shadow-sm shadow-red-100/50',
      )}
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <div>
        <p className="text-sm font-medium text-red-900">Something went wrong</p>
        <p className="mt-0.5 text-sm text-red-700">{message}</p>
      </div>
    </div>
  );
}
