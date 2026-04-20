import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';

export function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event) => {
      console.error(event.error || event.reason || event.message);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  if (hasError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-lg rounded-[32px] border border-white/70 bg-white/90 p-8 text-center shadow-[0_30px_90px_-45px_rgba(15,23,42,0.45)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">A small detour</p>
          <h1 className="mt-4 text-3xl font-bold text-stone-900">Something unexpected got in the way.</h1>
          <p className="mt-4 text-[15px] leading-7 text-stone-600">
            Refresh the page and we should be back on track. If it keeps happening, the issue is likely on our side, not yours.
          </p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Refresh and try again
          </Button>
        </div>
      </div>
    );
  }

  return children;
}
