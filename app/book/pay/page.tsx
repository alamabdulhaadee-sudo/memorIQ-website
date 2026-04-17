import type { Metadata } from 'next';
import PayPageClient from './PayPageClient';

export const metadata: Metadata = {
  title: 'Payment | Book MEMORIQ',
};

export default function PayPage() {
  return <PayPageClient />;
}
