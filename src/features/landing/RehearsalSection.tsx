import { RehearsalPreview } from './RehearsalPreview';
import { SectionIntro } from './SectionIntro';

export function RehearsalSection() {
    return (
        <section
            aria-labelledby="rehearsal-title"
            className="public-page-container grid gap-8 pt-10 pb-16 md:gap-9 md:pt-14 md:pb-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-16 lg:py-22 lg:pb-34 xl:gap-24"
            id="rehearsal-section"
        >
            <div className="lg:order-2">
                <SectionIntro id="rehearsal-title" title="A panel that tests the whole business">
                    <p>
                        Demand, product, and fundamentals all come under scrutiny. The panel listens
                        to your answer, then presses on the claim that matters.
                    </p>
                    <p>It feels like a conversation, not a list of prepared questions.</p>
                </SectionIntro>
            </div>
            <div className="lg:order-1">
                <RehearsalPreview />
            </div>
        </section>
    );
}
