import { cn } from '@humanlayer/ui/lib/utils'
import type { FC } from 'react'

export interface MobileTaskSectionHeaderProps {
	label: string
	count: number
	/** Highlight treatment for the attention-demanding "needs you" section. */
	tone?: 'default' | 'attention'
}

/**
 * Sticky section header for the grouped mobile tasks list. Uppercase label on
 * the left, count on the right.
 */
export const MobileTaskSectionHeader: FC<MobileTaskSectionHeaderProps> = ({ label, count, tone = 'default' }) => {
	return (
		<div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-background/95 px-4 py-1.5 backdrop-blur">
			<span
				className={cn(
					'text-[10px] font-medium uppercase tracking-wider',
					tone === 'attention' ? 'text-[var(--terminal-warning)]' : 'text-muted-foreground',
				)}
			>
				{label}
			</span>
			<span
				className={cn(
					'flex h-4 min-w-4 items-center justify-center px-1 text-[10px] tabular-nums',
					'border',
					tone === 'attention'
						? 'border-[var(--terminal-warning)]/40 text-[var(--terminal-warning)]'
						: 'border-border text-muted-foreground',
				)}
			>
				{count}
			</span>
		</div>
	)
}
