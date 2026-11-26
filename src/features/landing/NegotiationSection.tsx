import { OfferPreview } from './OfferPreview';
import { SectionIntro } from './SectionIntro';

export function NegotiationSection() {
    return (
        <section
            aria-labelledby="negotiation-title"
            className="public-page-container grid gap-8 pb-16 md:gap-9 md:pb-24 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-center lg:gap-16 lg:pt-10 lg:pb-36 xl:gap-24"
            id="negotiation-section"
        >
            <SectionIntro id="negotiation-title" title="Then the terms enter the room">
                <p>
                    An investor may pass, stay interested, or put an offer on the table. If terms
                    arrive, you can accept, reject, or counter.
                </p>
            </SectionIntro>
            <OfferPreview />
        </section>
    );
}
