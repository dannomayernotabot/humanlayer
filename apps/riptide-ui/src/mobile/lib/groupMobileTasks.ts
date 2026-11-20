import type { TaskWithActivity } from '@/hooks/useTasksByRecency'

/**
 * Which section a task belongs to on the mobile tasks list.
 *   needs_you — waiting on a human: pending approval, most recent session failed,
 *               or a lost session that needs recovery.
 *   running   — a session is actively in flight (running, launching, interrupting…).
 *   recent    — everything else, shown newest-first so any task stays reachable.
 */
export type MobileTaskBucket = 'needs_you' | 'running' | 'recent'

/** The subset of session fields the bucketing logic reads. */
export interface MobileSessionStatusRow {
	id: string
	task_id: string | null
	status: string | null
	last_activity_at: bigint | number | null
}

export interface MobileTaskGroups {
	needsYou: TaskWithActivity[]
	running: TaskWithActivity[]
	recent: TaskWithActivity[]
}

/**
 * Derive a task's section from its (non-archived) sessions. Mirrors the status
 * precedence in `useTaskStatuses` / `computeTaskStatus` so the grouping agrees
 * with the per-row status indicator.
 */
export function bucketForSessions(sessions: MobileSessionStatusRow[]): MobileTaskBucket {
	let needsApprovalCount = 0
	let lostCount = 0
	let runningCount = 0
	let pendingCount = 0
	let waitingForWorkspaceCount = 0
	let interruptRequestedCount = 0
	let mostRecentStatus: string | null = null
	let mostRecentLastActivityAt = Number.NEGATIVE_INFINITY

	for (const session of sessions) {
		switch (session.status) {
			case 'needs_approval':
				needsApprovalCount += 1
				break
			case 'running':
			case 'waiting_for_usage_limit':
				runningCount += 1
				break
			case 'lost':
				lostCount += 1
				break
			case 'ready_for_launch':
			case 'launching':
			case 'resuming':
				pendingCount += 1
				break
			case 'waiting_for_workspace':
				waitingForWorkspaceCount += 1
				break
			case 'interrupt_requested':
				interruptRequestedCount += 1
				break
		}

		const lastActivityAt =
			session.last_activity_at == null ? Number.NEGATIVE_INFINITY : Number(session.last_activity_at)
		if (lastActivityAt > mostRecentLastActivityAt) {
			mostRecentLastActivityAt = lastActivityAt
			mostRecentStatus = session.status
		}
	}

	if (needsApprovalCount > 0 || mostRecentStatus === 'failed' || lostCount > 0) return 'needs_you'
	if (runningCount > 0 || pendingCount > 0 || interruptRequestedCount > 0 || waitingForWorkspaceCount > 0)
		return 'running'
	return 'recent'
}

/**
 * Split recency-ordered tasks into the three mobile sections. Input order is
 * preserved within each section, so tasks stay newest-first.
 */
export function groupMobileTasks(
	tasks: TaskWithActivity[],
	sessionsByTaskId: Map<string, MobileSessionStatusRow[]>,
): MobileTaskGroups {
	const needsYou: TaskWithActivity[] = []
	const running: TaskWithActivity[] = []
	const recent: TaskWithActivity[] = []

	for (const task of tasks) {
		switch (bucketForSessions(sessionsByTaskId.get(task.id) ?? [])) {
			case 'needs_you':
				needsYou.push(task)
				break
			case 'running':
				running.push(task)
				break
			default:
				recent.push(task)
		}
	}

	return { needsYou, running, recent }
}
