import type { SessionLabel } from '@humanlayer/ui/components/session-label-badge'
import type { FC } from 'react'

import { MobileNeedsYouCard } from '@/mobile/components/pure/MobileNeedsYouCard'
import { MobileTaskRow, type TaskStatus } from '@/mobile/components/pure/MobileTaskRow'
import { MobileTaskSectionHeader } from '@/mobile/components/pure/MobileTaskSectionHeader'
import type { MobileTaskBucket } from '@/mobile/lib/groupMobileTasks'

/** The pending approval behind a Needs-you card's inline Approve action. */
export interface MobileTaskApproval {
	toolLabel: string
	inputPreview?: string | null
	/** Additional pending approvals beyond this one. */
	extraCount?: number
}

export interface MobileTasksListTask {
	taskId: string
	taskName: string
	label?: SessionLabel
	sessionCount: number
	status: TaskStatus
	isUnread?: boolean
	/** When set, the task renders as a Needs-you card with inline Approve. */
	approval?: MobileTaskApproval
}

export interface MobileTasksListSection {
	id: MobileTaskBucket
	label: string
	tasks: MobileTasksListTask[]
}

export interface MobileTaskSectionListProps {
	sections: MobileTasksListSection[]
	onTaskClick: (taskId: string) => void
	/** Resolve a task's headline pending approval from its Needs-you card. */
	onApprove?: (taskId: string) => void
	/** Task whose approval is currently being resolved. */
	approvingTaskId?: string | null
	/** Show sticky section headers. Off for single-section screens like Inbox. */
	showHeaders?: boolean
}

/**
 * Grouped list of task rows and Needs-you approval cards. Pure counterpart of
 * WiredMobileTaskSections, used by the pure mobile pages and their stories.
 */
export const MobileTaskSectionList: FC<MobileTaskSectionListProps> = ({
	sections,
	onTaskClick,
	onApprove,
	approvingTaskId,
	showHeaders = true,
}) => {
	return (
		<div>
			{sections
				.filter((section) => section.tasks.length > 0)
				.map((section) => (
					<section key={section.id}>
						{showHeaders && (
							<MobileTaskSectionHeader
								label={section.label}
								count={section.tasks.length}
								tone={section.id === 'needs_you' ? 'attention' : 'default'}
							/>
						)}
						<div className="divide-y divide-border">
							{section.tasks.map((task) =>
								task.approval ? (
									<MobileNeedsYouCard
										key={task.taskId}
										taskName={task.taskName}
										toolLabel={task.approval.toolLabel}
										inputPreview={task.approval.inputPreview}
										extraCount={task.approval.extraCount}
										isUnread={task.isUnread}
										approving={approvingTaskId === task.taskId}
										onReply={() => onTaskClick(task.taskId)}
										onApprove={() => onApprove?.(task.taskId)}
									/>
								) : (
									<MobileTaskRow
										key={task.taskId}
										taskId={task.taskId}
										taskName={task.taskName}
										label={task.label}
										sessionCount={task.sessionCount}
										status={task.status}
										isUnread={task.isUnread}
										onClick={() => onTaskClick(task.taskId)}
									/>
								),
							)}
						</div>
					</section>
				))}
		</div>
	)
}
