import { DebriefSection } from './DebriefSection';
import { HeroSection } from './HeroSection';
import { NegotiationSection } from './NegotiationSection';
import { RehearsalSection } from './RehearsalSection';

export function LandingPage() {
    return (
        <main id="top">
            <HeroSection />
            <RehearsalSection />
            <NegotiationSection />
            <DebriefSection />
        </main>
    );
}
