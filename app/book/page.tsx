import { redirect } from 'next/navigation';

// /book has no content — redirect to the first step of the booking flow.
export default function BookPage() {
  redirect('/book/date');
}
