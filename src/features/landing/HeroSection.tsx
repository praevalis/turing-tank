import Image from 'next/image';

import { Button } from '@/components/ui/Button';

export function HeroSection() {
    return (
        <section
            aria-labelledby="hero-title"
            className="public-page-container grid items-center gap-9 pt-12 pb-8 md:gap-12 md:pt-14 md:pb-12 lg:min-h-160 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-8 lg:py-8"
            id="hero-section"
        >
            <div className="relative z-10 max-w-xl">
                <h1
                    className="max-w-[12ch] font-display text-5xl leading-none font-bold tracking-tight sm:text-6xl lg:max-w-[10ch] lg:text-7xl"
                    id="hero-title"
                >
                    Face the room before it matters
                </h1>
                <p className="mt-6 max-w-[45ch] text-base leading-normal text-ink-muted md:text-lg lg:mt-8 lg:max-w-[30ch] lg:text-xl">
                    Rehearse with an AI investor panel that tests your pitch and follows your
                    answers.
                </p>
                <div className="mt-7 lg:mt-8">
                    <Button variant="primary">Start a rehearsal</Button>
                </div>
            </div>
            <div className="relative -mx-5 min-h-75 overflow-hidden bg-[radial-gradient(ellipse_72%_62%_at_50%_67%,#624760_0%,#3e3041_47%,transparent_86%),linear-gradient(180deg,#1b2029_0%,#29232f_64%,#10141b_100%)] [clip-path:polygon(3%_0,97%_0,100%_100%,0_100%)] after:pointer-events-none after:absolute after:bottom-0 after:z-30 after:h-11 after:w-full after:bg-[linear-gradient(0deg,#10141b_4%,transparent)] md:mx-0 md:aspect-8/5 md:min-h-0 md:[clip-path:polygon(5%_0,95%_0,100%_100%,0_100%)]">
                <Image
                    alt="Three empty investor chairs behind a desk, facing the founder."
                    className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-[88%] w-auto max-w-none -translate-x-1/2 md:h-auto md:w-full"
                    height={896}
                    priority
                    src="/illustrations/investor-panel-room.png"
                    width={1755}
                />
                <div className="absolute top-6 right-[5%] left-[5%] z-20 rounded-panel border border-accent-light/35 bg-[linear-gradient(135deg,#3b2d3bdc,#211f2bec)] px-3.5 py-3 shadow-[0_22px_44px_#07080c80,0_0_32px_#785a7226,inset_0_1px_#d9bed133] backdrop-blur-sm md:top-11 md:right-auto md:left-[12%] md:max-w-[76%] md:px-6 md:py-5">
                    <span className="mb-1 flex items-center gap-2 text-xs font-bold text-[#d5c0d0] before:size-2 before:rounded-full before:bg-accent-light before:shadow-[0_0_0_4px_#b59ab423] before:content-[''] md:mb-2 md:text-sm">
                        The panel asks
                    </span>
                    <strong className="block font-display text-base leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
                        Why will customers choose you?
                    </strong>
                </div>
            </div>
        </section>
    );
}
