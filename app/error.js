'use client';

/* * */

import AppError from '@/components/AppError/AppError';

/* * */

export default function Error({ error }) {
  return <AppError message={error.message} />;
}
