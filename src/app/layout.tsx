import type { Metadata } from 'next';
import { Bricolage_Grotesque, Newsreader } from 'next/font/google';

import './globals.css';

const bricolage = Bricolage_Grotesque({
    display: 'swap',
    subsets: ['latin'],
    variable: '--font-bricolage',
});

const newsreader = Newsreader({
    display: 'swap',
    subsets: ['latin'],
    variable: '--font-newsreader',
});

export const metadata: Metadata = {
    description: 'A demanding rehearsal for investor conversations.',
    title: 'Turing Tank',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html className={`${bricolage.variable} ${newsreader.variable}`} lang="en">
            <body>{children}</body>
        </html>
    );
}
