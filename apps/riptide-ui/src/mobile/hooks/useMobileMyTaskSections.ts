import { useAuth } from '@workos-inc/authkit-react'

import { useTasksByRecency } from '@/hooks/useTasksByRecency'

import { type MobileTaskSectionsResult, useMobileTaskSections } from './useMobileTaskSections'

export interface MobileMyTaskSectionsResult extends MobileTaskSectionsResult {
	/** Total tasks in scope, before grouping. */
	taskCount: number
}

/**
 * The current user's tasks grouped into Needs you / Running / Recent. Same scope
 * as the My Tasks tab: owned tasks plus shared tasks where the user has a session.
 */
export function useMobileMyTaskSections(): MobileMyTaskSectionsResult {
	const { user } = useAuth()
	const { tasks } = useTasksByRecency({ includeSessionsCreatedBy: user?.id })
	const { groups, unreadTaskIds } = useMobileTaskSections(tasks)
	return { groups, unreadTaskIds, taskCount: tasks.length }
}
