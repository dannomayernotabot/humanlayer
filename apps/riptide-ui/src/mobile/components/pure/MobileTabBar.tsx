import { cn } from '@humanlayer/ui/lib/utils'
import { Inbox, ListTodo, User } from 'lucide-react'
import type { FC } from 'react'

export type MobileTab = 'tasks' | 'inbox' | 'me'

export interface MobileTabBarProps {
	active: MobileTab
	/** Shows an attention dot on the Inbox tab when something is waiting on you. */
	inboxHasAttention?: boolean
	onSelect: (tab: MobileTab) => void
}

const TABS: { id: MobileTab; label: string; Icon: typeof Inbox }[] = [
	{ id: 'tasks', label: 'Tasks', Icon: ListTodo },
	{ id: 'inbox', label: 'Inbox', Icon: Inbox },
	{ id: 'me', label: 'Me', Icon: User },
]

/**
 * Fixed bottom navigation for the mobile app. Three destinations; the active
 * one is accented. Safe-area padding is supplied by the enclosing layout.
 */
export const MobileTabBar: FC<MobileTabBarProps> = ({ active, inboxHasAttention = false, onSelect }) => {
	return (
		<nav className="flex shrink-0 border-t border-border bg-background">
			{TABS.map(({ id, label, Icon }) => {
				const isActive = id === active
				return (
					<button
						key={id}
						type="button"
						onClick={() => onSelect(id)}
						aria-current={isActive ? 'page' : undefined}
						className={cn(
							'relative flex flex-1 flex-col items-center gap-1 py-2 pb-3',
							'text-[9px] uppercase tracking-wide transition-colors',
							isActive ? 'text-accent' : 'text-muted-foreground active:text-foreground',
						)}
					>
						<span className="relative">
							<Icon className="h-5 w-5" strokeWidth={2} />
							{id === 'inbox' && inboxHasAttention && (
								<span className="absolute -right-1.5 -top-0.5 h-2 w-2 rounded-full bg-[var(--terminal-warning)]" />
							)}
						</span>
						{label}
					</button>
				)
			})}
		</nav>
	)
}
