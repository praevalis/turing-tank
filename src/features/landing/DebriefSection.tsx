import { ReportPreview } from './ReportPreview';
import { SectionIntro } from './SectionIntro';

export function DebriefSection() {
    return (
        <section
            aria-labelledby="debrief-title"
            className="bg-[linear-gradient(180deg,#10141b_0%,#171a23_18%,#171a23_82%,#10141b_100%)] pt-12 pb-19 md:pt-16 md:pb-24 lg:pt-24 lg:pb-38"
            id="debrief-section"
        >
            <div className="public-page-container">
                <div className="mb-8 max-w-xl md:mb-13">
                    <SectionIntro id="debrief-title" title="A debrief grounded in evidence">
                        <p>
                            The report separates your claims from what the panel could verify.
                            Factual findings link to their sources and give you a next step.
                        </p>
                    </SectionIntro>
                </div>
                <ReportPreview />
            </div>
        </section>
    );
}
