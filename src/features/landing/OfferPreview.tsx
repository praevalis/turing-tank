export function OfferPreview() {
    return (
        <div
            aria-label="Example investment offer and founder counteroffer"
            className="relative rounded-panel bg-[linear-gradient(155deg,#3d2d3d_0%,#27212d_53%,#1b1c26_100%)] px-6 pt-7 pb-9 shadow-[inset_0_0_0_1px_#71586c,0_25px_60px_#07080e8c] before:pointer-events-none before:absolute before:inset-3 before:rounded-control before:border before:border-[#8b6b813d] before:content-[''] md:px-11 md:pt-9 md:pb-11 md:before:inset-4"
            role="group"
        >
            <div className="relative flex flex-col gap-1 text-xs font-bold text-[#d0b5c9] md:flex-row md:items-baseline md:justify-between md:gap-4 md:text-sm">
                <span className="uppercase">Offer on the table</span>
                <span className="font-medium text-[#b4a0ae]">Market &amp; growth investor</span>
            </div>
            <div className="relative mt-8 mb-6 md:mt-9 md:flex md:items-baseline md:gap-4">
                <strong className="block font-display text-5xl leading-none font-medium tracking-tighter md:text-6xl lg:text-7xl">
                    $250,000
                </strong>
                <span className="mt-1 block text-base text-[#ccb8c7] md:mt-0 md:text-lg">
                    for 10% equity
                </span>
            </div>
            <div className="relative grid gap-5 border-t border-[#89718482] py-5 md:grid-cols-2">
                <div>
                    <span className="mb-2 block text-xs font-bold uppercase text-[#bda7b8]">
                        Condition
                    </span>
                    <strong className="text-sm leading-snug font-semibold md:text-base">
                        Show referral and conversion rates from another cohort
                    </strong>
                </div>
                <div>
                    <span className="mb-2 block text-xs font-bold uppercase text-[#bda7b8]">
                        Why this offer
                    </span>
                    <strong className="text-sm leading-snug font-semibold md:text-base">
                        Referrals could lower acquisition cost, but repeatability is unproven
                    </strong>
                </div>
            </div>
            <div className="relative mx-2 mt-3 -mb-2 -rotate-2 rounded-control bg-[#ddd4db] px-5 py-4 text-[#2b2430] shadow-[0_12px_25px_#100c17a3] md:mx-4 md:px-6">
                <span className="block text-xs font-bold uppercase text-[#6e5269]">
                    Founder’s counter
                </span>
                <strong className="mt-1 block font-display text-xl font-semibold md:text-2xl">
                    $250,000 for 8% equity
                </strong>
            </div>
        </div>
    );
}
