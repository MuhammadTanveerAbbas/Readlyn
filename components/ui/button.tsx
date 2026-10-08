import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-base)] aria-invalid:ring-[var(--danger)]/20 aria-invalid:border-[var(--danger)]",
  {
    variants: {
      variant: {
        default: 'bg-[var(--accent)] text-[var(--accent-ink)] hover:bg-[var(--accent-hover)]',
        destructive:
          'bg-[var(--danger)] text-white hover:bg-[var(--danger)]/90 focus-visible:ring-[var(--danger)]/40',
        outline:
          'border border-[var(--line-default)] bg-transparent hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)] text-[var(--text-body)]',
        secondary:
          'bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:bg-[var(--surface-overlay)]',
        ghost:
          'text-[var(--text-body)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]',
        link: 'text-[var(--accent)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
