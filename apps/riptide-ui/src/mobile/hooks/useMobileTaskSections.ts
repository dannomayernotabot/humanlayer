import { eq, not, useLiveQuery } from '@tanstack/react-db'
import { useMemo } from 'react'

import { useSync } from '@/components/providers/SyncProvider'
import { useUnreadStore } from '@/hooks/stores/unreadStore'
import type { TaskWithActivity } from '@/hooks/useTasksByRecency'
import { groupMobileTasks, type MobileSessionStatusRow, type MobileTaskGroups } from '@/mobile/lib/groupMobileTasks'

export interface MobileTaskSectionsResult {
	groups: MobileTaskGroups
	/** Task IDs with at least one unread (non-archived) session. */
	unreadTaskIds: Set<string>
}

/**
 * Groups the given tasks into Needs you / Running / Recent sections using a
 * single live query over all non-archived sessions, so each task's status is
 * derived at the list level without per-row hooks. Also reports which tasks
 * have unseen session activity.
 */
export function useMobileTaskSections(tasks: TaskWithActivity[]): MobileTaskSectionsResult {
	const { sessionsCollection } = useSync()
	const unreadSessionIds = useUnreadStore((s) => s.unreadSessionIds)

	const { data: sessionRows } = useLiveQuery(
		(q) =>
			q
				.from({ sessions: sessionsCollection })
				.select(({ sessions }) => ({
					id: sessions.id,
					task_id: sessions.task_id,
					status: sessions.status,
					last_activity_at: sessions.last_activity_at,
				}))
				.where(({ sessions }) => not(eq(sessions.archived, true))),
		[sessionsCollection],
	)

	return useMemo(() => {
		const sessionsByTaskId = new Map<string, MobileSessionStatusRow[]>()
		const unreadTaskIds = new Set<string>()

		for (const row of sessionRows ?? []) {
			if (!row.task_id) continue
			const existing = sessionsByTaskId.get(row.task_id)
			if (existing) existing.push(row)
			else sessionsByTaskId.set(row.task_id, [row])
			if (unreadSessionIds.has(row.id)) unreadTaskIds.add(row.task_id)
		}

		return { groups: groupMobileTasks(tasks, sessionsByTaskId), unreadTaskIds }
	}, [tasks, sessionRows, unreadSessionIds])
}
