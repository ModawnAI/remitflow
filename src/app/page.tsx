import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'RemitFlow - WhatsApp Remittance',
  description: 'Send money to Nigeria as easy as sending a WhatsApp message',
};

export default function HomePage() {
  // Redirect to dashboard for now
  redirect('/dashboard');
}
