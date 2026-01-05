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
    default: 'RemitFlow - UK to Nigeria Money Transfer',
    template: '%s | RemitFlow',
  },
  description: 'Send money to Nigeria as easy as sending a WhatsApp message. Fast, secure, and affordable remittance service with real-time tracking and the best exchange rates.',
  keywords: ['remittance', 'UK to Nigeria', 'money transfer', 'WhatsApp', 'stablecoin', 'international transfer', 'send money', 'GBP to NGN'],
  authors: [{ name: 'RemitFlow' }],
  creator: 'RemitFlow',
  publisher: 'RemitFlow',
  metadataBase: new URL('https://remitflow-two.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://remitflow-two.vercel.app',
    siteName: 'RemitFlow',
    title: 'RemitFlow - UK to Nigeria Money Transfer',
    description: 'Send money to Nigeria as easy as sending a WhatsApp message. Fast, secure, and affordable remittance with real-time tracking.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RemitFlow - Send money to Nigeria',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RemitFlow - UK to Nigeria Money Transfer',
    description: 'Send money to Nigeria as easy as sending a WhatsApp message. Fast, secure, and affordable.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
