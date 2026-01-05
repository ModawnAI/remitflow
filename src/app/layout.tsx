import type { Metadata } from 'next';
import { Inter, Calistoga, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

// Body/UI Font - Clean, highly legible sans-serif
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

// Display Font - Warm, characterful serif for headlines
const calistoga = Calistoga({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-calistoga',
  display: 'swap',
});

// Monospace Font - For section labels, badges, and technical text
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'RemitFlow',
    template: '%s | RemitFlow',
  },
  description: 'Send money to Nigeria as easy as sending a WhatsApp message',
  keywords: ['remittance', 'UK to Nigeria', 'money transfer', 'WhatsApp', 'stablecoin'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${calistoga.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
