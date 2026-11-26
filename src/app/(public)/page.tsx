export default function HomePage() {
    return (
        <main className="public-page-container flex min-h-[calc(100vh-4.5rem)] items-center justify-center md:min-h-[calc(100vh-5.75rem)]">
            <section className="max-w-2xl space-y-4 text-center">
                <p className="text-ink-muted text-sm font-medium uppercase tracking-[0.3em]">
                    Turing Tank
                </p>
                <h1 className="font-display text-4xl font-semibold sm:text-5xl">
                    Rehearse the hard questions.
                </h1>
                <p className="text-ink-muted text-lg leading-8">
                    The application foundation is ready for the first product workflow.
                </p>
            </section>
        </main>
    );
}
