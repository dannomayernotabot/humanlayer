import type { FC } from 'react'

export interface MobileScreenHeaderProps {
	title: string
	/** Optional count shown next to the title, e.g. items waiting in Inbox. */
	count?: number
}

/** Top header for a mobile tab screen (Inbox, Me). */
export const MobileScreenHeader: FC<MobileScreenHeaderProps> = ({ title, count }) => {
	return (
		<header className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
			<h1 className="text-base font-medium">{title}</h1>
			{count !== undefined && count > 0 && (
				<span className="flex h-5 min-w-5 items-center justify-center border border-[var(--terminal-warning)]/40 px-1.5 text-[11px] tabular-nums text-[var(--terminal-warning)]">
					{count}
				</span>
			)}
		</header>
	)
}
