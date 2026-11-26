import type { ReactNode } from 'react';

interface SectionIntroProps {
    children: ReactNode;
    id: string;
    title: string;
}

export function SectionIntro({ children, id, title }: SectionIntroProps) {
    return (
        <div>
            <h2
                className="font-display text-4xl leading-none font-bold tracking-tight lg:text-5xl"
                id={id}
            >
                {title}
            </h2>
            <div className="mt-4 max-w-[36ch] space-y-4 text-base leading-normal text-ink-muted md:text-lg lg:mt-5">
                {children}
            </div>
        </div>
    );
}
