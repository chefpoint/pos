/* * */

import '@/styles/reset.css';
import '@/styles/default.css';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

/* * */

import Providers from './providers';
import { Work_Sans } from 'next/font/google';
import { ColorSchemeScript } from '@mantine/core';
import { getCssText } from '../stitches.config';

/* * */

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'auto',
});

/* * */

export default function RootLayout({ children }) {
  return (
    <html className={workSans.variable}>
      <head>
        <ColorSchemeScript />
        <title>CHEF POINT Kiosk</title>
        <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
        <meta name="viewport" content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width, height=device-height" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
