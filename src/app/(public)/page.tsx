import type { Metadata } from 'next';

import { LandingPage } from '@/features/landing/LandingPage';

export const metadata: Metadata = {
    description:
        'Rehearse your pitch with an AI investor panel that tests your claims, follows your answers, and explains its decisions.',
    title: 'Turing Tank',
};

export default function HomePage() {
    return <LandingPage />;
}
