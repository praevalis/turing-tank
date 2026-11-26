import { Navbar } from '@/components/layout/Navbar';

export default function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
