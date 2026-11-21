import { useNavigate } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { useTaskHasNextStep } from '@/hooks/live-queries/useTaskHasNextStep'
import { useTaskMostProgressedLabel } from '@/hooks/live-queries/useTaskMostProgressedLabel'
import { useTaskStatuses } from '@/hooks/live-queries/useTaskStatuses'
import { useApprovalActions } from '@/hooks/useApprovalActions'
import type { TaskWithActivity } from '@/hooks/useTasksByRecency'
import { MobileTaskRow, type TaskStatus } from '@/mobile/components/pure/MobileTaskRow'
import { MobileTaskSectionHeader } from '@/mobile/components/pure/MobileTaskSectionHeader'
import { WiredMobileNeedsYouCard } from '@/mobile/components/wired/WiredMobileNeedsYouCard'
import { useMobilePendingApprovals } from '@/mobile/hooks/useMobilePendingApprovals'
import type { MobileTaskGroups } from '@/mobile/lib/groupMobileTasks'

function computeTaskStatus(
	statuses: {
		needsApprovalCount: number
		mostRecentSessionFailed: boolean
		lostCount: number
		runningCount: number
		pendingCount: number
		interruptRequestedCount: number
	},
	hasNextStep: boolean,
): TaskStatus {
	if (statuses.needsApprovalCount > 0) return 'needs_approval'
	if (statuses.mostRecentSessionFailed) return 'failed'
	if (statuses.lostCount > 0) return 'lost'
	if (statuses.runningCount > 0) return 'running'
	if (statuses.pendingCount > 0) return 'pending'
	if (statuses.interruptRequestedCount > 0) return 'interrupt_requested'
	if (hasNextStep) return 'has_next_step'
	return 'idle'
}

/**
 * Per-task wired row — resolves label and status hooks for one task,
 * then renders the pure MobileTaskRow with a computed status string.
 */
function WiredMobileTaskRow({
	task,
	isUnread,
	onClick,
}: {
	task: TaskWithActivity
	isUnread: boolean
	onClick: (taskId: string) => void
}) {
	const { label } = useTaskMostProgressedLabel(task.id)
	const { hasNextStep } = useTaskHasNextStep(task.id)
	const statuses = useTaskStatuses(task.id)

	const status = computeTaskStatus(statuses, hasNextStep)

	return (
		<MobileTaskRow
			taskId={task.id}
			taskName={task.name}
			label={label ?? undefined}
			sessionCount={task.sessionCount}
			status={status}
			isUnread={isUnread}
			onClick={() => onClick(task.id)}
		/>
	)
}

export type MobileSectionKey = keyof MobileTaskGroups

const SECTION_LABELS: Record<MobileSectionKey, string> = {
	needsYou: 'Needs you',
	running: 'Running',
	recent: 'Recent',
}

const ALL_SECTIONS: MobileSectionKey[] = ['needsYou', 'running', 'recent']

export interface WiredMobileTaskSectionsProps {
	groups: MobileTaskGroups
	unreadTaskIds: Set<string>
	/** Sections to render, in order. Defaults to Needs you, Running, Recent. */
	sections?: MobileSectionKey[]
	/** Show the sticky section headers. Off for single-section screens like Inbox. */
	showHeaders?: boolean
}

/**
 * Grouped task list shared by the mobile Tasks and Inbox screens. Needs-you
 * tasks with a pending approval render as cards with inline Approve; every
 * other task renders as a row that opens the task.
 */
export function WiredMobileTaskSections({
	groups,
	unreadTaskIds,
	sections = ALL_SECTIONS,
	showHeaders = true,
}: WiredMobileTaskSectionsProps) {
	const navigate = useNavigate()
	const pendingApprovals = useMobilePendingApprovals()
	const { approve } = useApprovalActions()
	const [approvingTaskId, setApprovingTaskId] = useState<string | null>(null)

	const handleTaskClick = (taskId: string) => {
		navigate({ to: '/tasks/$taskId', params: { taskId } })
	}

	const handleApprove = useCallback(
		async (taskId: string, approvalId: string) => {
			setApprovingTaskId(taskId)
			try {
				await approve(approvalId)
			} catch {
				toast.error('Could not approve the request. Open the task to try again.')
			} finally {
				setApprovingTaskId((current) => (current === taskId ? null : current))
			}
		},
		[approve],
	)

	return (
		<div>
			{sections.map((key) => {
				const tasks = groups[key]
				if (tasks.length === 0) return null
				return (
					<section key={key}>
						{showHeaders && (
							<MobileTaskSectionHeader
								label={SECTION_LABELS[key]}
								count={tasks.length}
								tone={key === 'needsYou' ? 'attention' : 'default'}
							/>
						)}
						<div className="divide-y divide-border">
							{tasks.map((task) => {
								const approval = key === 'needsYou' ? pendingApprovals.get(task.id) : undefined
								if (approval) {
									return (
										<WiredMobileNeedsYouCard
											key={task.id}
											taskName={task.name}
											sessionId={approval.sessionId}
											toolLabel={approval.toolLabel}
											inputPreview={approval.inputPreview}
											extraCount={Math.max(0, approval.count - 1)}
											isUnread={unreadTaskIds.has(task.id)}
											approving={approvingTaskId === task.id}
											onReply={() => handleTaskClick(task.id)}
											onApprove={() => handleApprove(task.id, approval.approvalId)}
										/>
									)
								}
								return (
									<WiredMobileTaskRow
										key={task.id}
										task={task}
										isUnread={unreadTaskIds.has(task.id)}
										onClick={handleTaskClick}
									/>
								)
							})}
						</div>
					</section>
				)
			})}
		</div>
	)
}
