import Image from 'next/image';
import Link from 'next/link';

export function Navbar() {
    return (
        <header className="public-page-container flex h-18 items-center md:h-23">
            <nav aria-label="Primary navigation">
                <Link className="inline-flex items-center" href="/">
                    <Image
                        alt="Turing Tank home"
                        className="h-9 w-auto md:h-11"
                        height={44}
                        src="/brand/logo.svg"
                        width={180}
                    />
                </Link>
            </nav>
        </header>
    );
}
