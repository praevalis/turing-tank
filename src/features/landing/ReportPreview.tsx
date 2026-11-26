import Image from 'next/image';

import { cn } from '@/utils/cn';

const evidenceItems = [
    {
        title: 'Session answer',
        detail: 'The founder expects referrals from early customers.',
    },
    {
        title: 'Pitch materials',
        detail: 'No referral or conversion figures supplied.',
    },
];

export function ReportPreview() {
    return (
        <div
            aria-label="Session debrief preview"
            className="mx-auto max-w-5xl rounded-panel bg-paper px-6 pt-7 pb-9 text-paper-ink shadow-[0_32px_75px_#05070ca8] md:px-12 md:pt-9 md:pb-13"
            role="group"
        >
            <div className="flex flex-wrap items-center justify-between gap-5 border-b border-[#b7afb6] pb-5">
                <div className="inline-flex items-center gap-0.5">
                    <Image alt="" height={30} loading="eager" src="/brand/mark.svg" width={30} />
                    <strong className="text-base leading-none font-bold tracking-tight text-[#624760] md:text-lg">
                        Turing Tank
                    </strong>
                </div>
                <span className="text-xs text-[#5b535d] md:text-sm">Session debrief</span>
            </div>
            <div className="my-9 flex gap-3 md:gap-5">
                <span
                    aria-hidden="true"
                    className="w-11 shrink-0 font-display text-3xl leading-none text-[#9b7991] md:w-18 md:text-5xl"
                >
                    01
                </span>
                <div>
                    <span className="mb-2 block text-xs font-bold uppercase text-[#634d60] md:text-sm">
                        Customer acquisition
                    </span>
                    <h3 className="font-display text-3xl leading-tight font-semibold md:text-4xl">
                        Referrals need evidence
                    </h3>
                </div>
            </div>
            <div className="grid gap-7 md:gap-11 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div>
                    <div className="rounded-control bg-[#dcd0d9] p-5 md:px-6 md:py-6">
                        <p className="mb-2 text-xs font-bold uppercase text-[#634d60] md:text-sm">
                            Your answer
                        </p>
                        <blockquote className="max-w-[31ch] font-display text-xl leading-snug md:text-2xl">
                            Our early customers{' '}
                            <mark className="bg-[#bfa6b9] px-0.5 text-inherit">
                                will refer people they know
                            </mark>
                            .
                        </blockquote>
                    </div>
                    <div className="mt-7 grid gap-3.5">
                        <p className="text-xs font-bold uppercase text-[#634d60] md:text-sm">
                            Evidence record
                        </p>
                        {evidenceItems.map(({ title, detail }, index) => (
                            <div
                                className="flex items-start gap-3 text-sm leading-snug md:text-base"
                                key={title}
                            >
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'mt-1 size-2 shrink-0 rounded-full border-2 border-accent',
                                        index === 0 && 'bg-accent',
                                    )}
                                />
                                <div>
                                    <strong className="block">{title}</strong>
                                    <small className="mt-0.5 block text-sm text-[#514b53]">
                                        {detail}
                                    </small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="rounded-control bg-[#f6f1f2] p-5 md:p-6">
                    <span className="mb-2 block text-xs font-bold uppercase text-[#634d60] md:text-sm">
                        Why the panel pressed
                    </span>
                    <p className="text-sm leading-normal md:text-base">
                        Referrals could reduce acquisition cost, but the answer did not show how
                        many customers refer or convert.
                    </p>
                    <span className="mt-7 mb-2 block text-xs font-bold uppercase text-[#634d60] md:text-sm">
                        Effect on the offer
                    </span>
                    <p className="text-sm leading-normal md:text-base">
                        The market and growth investor offered terms conditional on stronger
                        referral evidence.
                    </p>
                </div>
            </div>
            <div className="mt-9 rounded-control bg-[#3a2b3a] p-5 text-[#f4ecf0] md:flex md:gap-6 md:p-6">
                <span className="block text-xs font-bold uppercase leading-snug text-[#d6bad0] md:w-36 md:shrink-0 md:text-sm">
                    Next rehearsal
                </span>
                <strong className="mt-2 block text-sm leading-snug font-semibold md:mt-0 md:text-lg">
                    Bring referral and conversion figures, or test another path to your next
                    thousand customers.
                </strong>
            </div>
        </div>
    );
}
