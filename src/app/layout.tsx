import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
    description: 'A demanding rehearsal for investor conversations.',
    title: 'Turing Tank',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
