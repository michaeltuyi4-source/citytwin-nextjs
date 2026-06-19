import type { Metadata } from 'next';
import { DM_Serif_Display, DM_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import 'mapbox-gl/dist/mapbox-gl.css';
import './globals.css';

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CityTwin - Find the neighborhood where your life already exists',
  description: 'CityTwin matches you to neighborhoods based on how you live - coffee, fitness, faith, community and more. Free to try across 8 US cities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="canonical" href="https://www.citytwinapp.com" />
        <meta name="description" content="CityTwin matches you to neighborhoods based on how you live - coffee, fitness, faith, community and more. Free to try across 8 US cities." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CityTwin" />
        <meta property="og:title" content="CityTwin - Find the neighborhood where your life already exists" />
        <meta property="og:description" content="Match your lifestyle to real neighborhoods across the US. Coffee, fitness, faith, community - all weighted by priority." />
        <meta property="og:image" content="https://www.citytwinapp.com/images/pexels-samson-katt-5225319.jpg" />
        <meta property="og:url" content="https://www.citytwinapp.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CityTwin - Find the neighborhood where your life already exists" />
        <meta name="twitter:description" content="Match your lifestyle to real neighborhoods across the US." />
        <meta name="twitter:image" content="https://www.citytwinapp.com/images/pexels-samson-katt-5225319.jpg" />
      </head>
      <body
        className={`${dmSerifDisplay.variable} ${dmSans.variable}`}
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
