import Image from 'next/image';

export function RehearsalPreview() {
    return (
        <div
            aria-label="Example live rehearsal"
            className="overflow-hidden rounded-frame border border-[#3e414e] bg-surface shadow-[0_26px_65px_#080a1199]"
            role="group"
        >
            <div className="flex items-center justify-between gap-5 bg-surface-raised px-5 py-4 md:px-7 md:py-5">
                <span className="flex items-center gap-3 text-sm font-semibold before:size-2 before:rounded-full before:bg-accent-light before:shadow-[0_0_0_5px_#b59ab421] before:content-[''] md:text-base">
                    Investor Panel
                </span>
                <span className="relative grid size-18 place-items-center md:size-20">
                    <Image
                        alt=""
                        className="absolute inset-0 size-full"
                        height={80}
                        src="/illustrations/stopwatch.svg"
                        width={80}
                    />
                    <strong className="absolute top-[60%] left-1/2 -translate-1/2 text-sm tabular-nums">
                        <span aria-hidden="true">8:42</span>
                        <span className="sr-only">
                            Example timer: eight minutes and forty-two seconds remaining
                        </span>
                    </strong>
                </span>
            </div>
            <div className="min-h-64 bg-[radial-gradient(ellipse_at_84%_12%,#46344466,transparent_58%)] px-5 py-7 md:min-h-76 md:px-9 md:py-9">
                <div className="flex items-center gap-3 text-xs font-bold text-[#cdb6c7] md:text-sm">
                    <Image alt="" height={24} src="/illustrations/voice-bars.svg" width={36} />
                    The panel follows up
                </div>
                <h3 className="mt-6 max-w-[22ch] font-display text-2xl leading-tight font-medium tracking-tight md:text-3xl lg:text-4xl">
                    What shows referrals will work{' '}
                    <em className="not-italic text-[#c5a7bf]">beyond your first customers?</em>
                </h3>
            </div>
            <div className="bg-[#292934] px-5 py-5 text-sm leading-snug md:flex md:gap-4 md:px-9 md:text-base">
                <span className="shrink-0 font-bold text-[#c5a7bf]">You said</span>
                <p className="mt-1 text-[#e4dce2] md:mt-0">
                    “Our early customers will refer people they know.”
                </p>
            </div>
            <div className="m-4 flex items-center justify-between gap-3 rounded-panel bg-[#242532] py-2 pr-2 pl-4 text-sm text-[#afaab7] ring-2 ring-accent-light/25 md:mx-7 md:mt-5 md:mb-6 md:pl-5 md:text-base">
                <span>Answer the panel…</span>
                <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-light"
                >
                    <Image alt="" height={20} src="/illustrations/answer-check.svg" width={20} />
                </span>
            </div>
        </div>
    );
}
