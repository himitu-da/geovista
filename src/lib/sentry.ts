
import * as Sentry from '@sentry/react';

export const initializeSentry = () => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [],
      tracesSampleRate: 1.0,
      environment: import.meta.env.MODE,
    });
  } else {
    console.warn('Sentry DSN not provided, error tracking disabled');
  }
};

export const captureException = (error: unknown) => {
  console.error(error);
  Sentry.captureException(error);
};
