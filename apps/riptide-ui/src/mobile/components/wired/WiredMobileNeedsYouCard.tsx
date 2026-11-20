import { eq, useLiveQuery } from '@tanstack/react-db'

import { useSync } from '@/components/providers/SyncProvider'
import { useSessionHostState } from '@/hooks/live-queries/use-session-host-state'
import { deriveSessionHostView } from '@/lib/session-host-state'
import { MobileNeedsYouCard } from '@/mobile/components/pure/MobileNeedsYouCard'

export interface WiredMobileNeedsYouCardProps {
	taskName: string
	sessionId: string
	toolLabel: string
	inputPreview: string | null
	extraCount: number
	isUnread: boolean
	approving: boolean
	onReply: () => void
	onApprove: () => void
}

/**
 * Wired Needs-you card. Resolves the approval's session so it can gate the
 * inline Approve on host status — when the host is offline the daemon can't act
 * on the decision, so Approve is hidden (matching the session detail view) and
 * Reply still opens the session.
 */
export function WiredMobileNeedsYouCard({
	taskName,
	sessionId,
	toolLabel,
	inputPreview,
	extraCount,
	isUnread,
	approving,
	onReply,
	onApprove,
}: WiredMobileNeedsYouCardProps) {
	const { sessionsCollection } = useSync()
	const { data: sessionRows } = useLiveQuery(
		(q) =>
			q
				.from({ sessions: sessionsCollection })
				.select(({ sessions }) => ({
					id: sessions.id,
					host_id: sessions.host_id,
					organization_id: sessions.organization_id,
					created_by: sessions.created_by,
				}))
				.where(({ sessions }) => eq(sessions.id, sessionId)),
		[sessionsCollection, sessionId],
	)

	const { state, isLocal } = useSessionHostState(sessionRows?.[0])
	const { isHostOffline } = deriveSessionHostView(state, isLocal)

	return (
		<MobileNeedsYouCard
			taskName={taskName}
			toolLabel={toolLabel}
			inputPreview={inputPreview}
			extraCount={extraCount}
			isUnread={isUnread}
			approving={approving}
			approveDisabled={isHostOffline}
			approveDisabledReason={isHostOffline ? 'Host offline' : undefined}
			onReply={onReply}
			onApprove={onApprove}
		/>
	)
}
