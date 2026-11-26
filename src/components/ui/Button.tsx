import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

const buttonStyles = cva(
    'inline-flex min-h-13 items-center justify-center rounded-control px-7 text-center text-sm font-bold no-underline transition-[filter] duration-150 md:min-h-14 md:text-base',
    {
        variants: {
            variant: {
                primary:
                    'border border-[#9a7891] bg-[radial-gradient(ellipse_92%_145%_at_50%_85%,#785a72_0%,#624760_44%,transparent_84%),linear-gradient(180deg,#3e3041_0%,#29232f_100%)] text-ink shadow-[0_12px_28px_#6247604d,inset_0_1px_#b59ab455] hover:brightness-110',
            },
        },
        defaultVariants: {
            variant: 'primary',
        },
    },
);

export interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonStyles> {}

export function Button({ className, type = 'button', variant, ...props }: ButtonProps) {
    return <button {...props} className={cn(buttonStyles({ variant }), className)} type={type} />;
}
