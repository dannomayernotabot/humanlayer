import { Button } from '@humanlayer/ui/components/button'
import { LogOut, Settings } from 'lucide-react'
import type { FC } from 'react'

export interface MobileMePanelProps {
	name: string | null
	email: string | null
	onOpenSettings: () => void
	onSignOut: () => void
}

function initials(name: string | null, email: string | null): string {
	const source = name?.trim() || email?.trim() || ''
	const [first, second] = source.split(/[\s@._-]+/).filter(Boolean)
	const letters = first && second ? `${first.charAt(0)}${second.charAt(0)}` : source.slice(0, 2)
	return letters.toUpperCase() || '?'
}

/** Account panel for the mobile Me tab: who is signed in, plus settings and sign out. */
export const MobileMePanel: FC<MobileMePanelProps> = ({ name, email, onOpenSettings, onSignOut }) => {
	return (
		<div className="flex flex-col gap-6 px-4 py-6">
			<div className="flex items-center gap-3">
				<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-medium text-accent">
					{initials(name, email)}
				</div>
				<div className="min-w-0">
					{name && <p className="truncate text-sm font-medium">{name}</p>}
					{email && <p className="truncate text-xs text-muted-foreground">{email}</p>}
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<Button variant="outline" className="w-full justify-start" onClick={onOpenSettings}>
					<Settings className="h-4 w-4" />
					Settings
				</Button>
				<Button variant="destructive" className="w-full justify-start" onClick={onSignOut}>
					<LogOut className="h-4 w-4" />
					Sign out
				</Button>
			</div>
		</div>
	)
}
