import { eq, useLiveQuery } from '@tanstack/react-db'
import { useMemo } from 'react'

import { useSync } from '@/components/providers/SyncProvider'
import { describeApprovalRequest } from '@/lib/approvals/describeApprovalRequest'

export interface MobilePendingApproval {
	/** The approval to resolve when the user taps Approve. */
	approvalId: string
	sessionId: string
	toolLabel: string
	inputPreview: string | null
	/** Total pending approvals for the task (>= 1). */
	count: number
}

/**
 * Live map of task id → the task's most recent pending approval, with a count
 * of how many are pending. Lets the tasks list surface an inline approve on the
 * Needs-you cards without opening the session.
 */
export function useMobilePendingApprovals(): Map<string, MobilePendingApproval> {
	const { approvalsCollection } = useSync()

	const { data: approvals } = useLiveQuery(
		(q) => q.from({ approvals: approvalsCollection }).where(({ approvals }) => eq(approvals.status, 'pending')),
		[approvalsCollection],
	)

	return useMemo(() => {
		const byTask = new Map<string, MobilePendingApproval>()
		const counts = new Map<string, number>()

		// Newest first so the headline approval is the most recent one.
		const list = approvals ?? []
		const sorted = [...list].sort((a, b) => Number(b.created_at ?? 0n) - Number(a.created_at ?? 0n))

		for (const approval of sorted) {
			const taskId = approval.task_id
			if (!taskId) continue
			counts.set(taskId, (counts.get(taskId) ?? 0) + 1)
			if (!byTask.has(taskId)) {
				const { toolLabel, inputPreview } = describeApprovalRequest(approval)
				byTask.set(taskId, {
					approvalId: approval.id,
					sessionId: approval.session_id,
					toolLabel,
					inputPreview,
					count: 0,
				})
			}
		}

		for (const [taskId, entry] of byTask) {
			entry.count = counts.get(taskId) ?? 1
		}

		return byTask
	}, [approvals])
}
