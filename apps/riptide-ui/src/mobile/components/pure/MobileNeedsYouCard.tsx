import { Button } from '@humanlayer/ui/components/button'
import { Check } from 'lucide-react'
import type { FC } from 'react'

export interface MobileNeedsYouCardProps {
	taskName: string
	/** Friendly tool name for the pending approval, e.g. "Bash". */
	toolLabel: string
	/** One-line preview of what the agent wants to do. */
	inputPreview?: string | null
	/** Pending approvals beyond this one, shown as "+N more waiting". */
	extraCount?: number
	isUnread?: boolean
	/** True while the approve request is in flight. */
	approving?: boolean
	onReply: () => void
	onApprove: () => void
}

/**
 * Prominent card for a task waiting on your approval. Shows what the agent is
 * asking, with inline Reply (opens the session) and Approve (resolves in place).
 */
export const MobileNeedsYouCard: FC<MobileNeedsYouCardProps> = ({
	taskName,
	toolLabel,
	inputPreview,
	extraCount = 0,
	isUnread = false,
	approving = false,
	onReply,
	onApprove,
}) => {
	return (
		<div className="border-b border-border bg-[var(--terminal-warning)]/5 px-4 py-3">
			<div className="border-l-2 border-[var(--terminal-warning)] pl-3">
				<div className="flex items-center gap-2">
					{isUnread && (
						<span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-label="Unseen activity" />
					)}
					<span className="min-w-0 flex-1 truncate text-sm font-medium">{taskName}</span>
				</div>

				<p className="mt-1.5 text-xs leading-relaxed text-foreground/90">
					<span className="font-medium">{toolLabel}</span>
					{inputPreview ? <span className="text-muted-foreground"> · {inputPreview}</span> : null}
				</p>

				{extraCount > 0 && <p className="mt-1 text-[11px] text-muted-foreground">+{extraCount} more waiting</p>}

				<div className="mt-3 flex gap-2">
					<Button variant="outline" size="sm" className="flex-1" onClick={onReply} disabled={approving}>
						Reply
					</Button>
					<Button
						variant="loud-success-cta"
						size="sm"
						className="flex-1"
						onClick={onApprove}
						disabled={approving}
					>
						<Check className="h-4 w-4" />
						{approving ? 'Approving…' : 'Approve'}
					</Button>
				</div>
			</div>
		</div>
	)
}
