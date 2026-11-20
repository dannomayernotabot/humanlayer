import { Button } from '@humanlayer/ui/components/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@humanlayer/ui/components/tabs'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@workos-inc/authkit-react'
import { Plus, Users } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'

import type { SessionsRouteTab, SessionsRouteTo } from '@/components/sessions-page/sessionsRoute'
import { useTaskHasNextStep } from '@/hooks/live-queries/useTaskHasNextStep'
import { useTaskMostProgressedLabel } from '@/hooks/live-queries/useTaskMostProgressedLabel'
import { useTaskStatuses } from '@/hooks/live-queries/useTaskStatuses'
import { useApprovalActions } from '@/hooks/useApprovalActions'
import { type TaskWithActivity, useTasksByRecency } from '@/hooks/useTasksByRecency'
import { MobileTaskRow, type TaskStatus } from '@/mobile/components/pure/MobileTaskRow'
import { MobileTaskSectionHeader } from '@/mobile/components/pure/MobileTaskSectionHeader'
import { WiredMobileNeedsYouCard } from '@/mobile/components/wired/WiredMobileNeedsYouCard'
import { useMobilePendingApprovals } from '@/mobile/hooks/useMobilePendingApprovals'
import { useMobileTaskSections } from '@/mobile/hooks/useMobileTaskSections'
import { MobileAppLayout } from '@/mobile/layouts/MobileAppLayout'
import type { MobileTaskGroups } from '@/mobile/lib/groupMobileTasks'
import type { MobileTasksTab } from '@/mobile/pages/pure/MobileTasksListPage'

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

const SECTION_META: { key: keyof MobileTaskGroups; id: 'needs_you' | 'running' | 'recent'; label: string }[] = [
	{ key: 'needsYou', id: 'needs_you', label: 'Needs you' },
	{ key: 'running', id: 'running', label: 'Running' },
	{ key: 'recent', id: 'recent', label: 'Recent' },
]

/**
 * Wired mobile tasks list page.
 * Two tabs synced to the same `tab` search param the desktop sessions page uses:
 *   My Tasks — same ownership filter as the desktop tasks tab
 *   Shared Tasks — teammates' tasks, same filter as the desktop shared tasks tab
 * Within each tab, tasks are grouped into Needs you / Running / Recent sections.
 */
export function WiredMobileTasksListPage({ tab, routeTo }: { tab: SessionsRouteTab; routeTo: SessionsRouteTo }) {
	const navigate = useNavigate()
	const { user } = useAuth()

	const activeTab: MobileTasksTab = tab === 'shared-tasks' ? 'shared-tasks' : 'my-tasks'

	// Same filter as desktop sessions list tasks tab:
	// owned tasks + shared tasks where the current user has a session
	const { tasks: myTasks } = useTasksByRecency({ includeSessionsCreatedBy: user?.id })

	// Same filter as desktop shared tasks tab:
	// all visible tasks, minus the ones the current user owns
	const { tasks: allTasks } = useTasksByRecency({ ownedOnly: false, userId: user?.id })
	const sharedTasks = useMemo(() => {
		if (!user?.id) return []
		return allTasks.filter((t) => t.resource_owner_user_id !== user.id)
	}, [allTasks, user?.id])

	const { groups: myGroups, unreadTaskIds: myUnread } = useMobileTaskSections(myTasks)
	const { groups: sharedGroups, unreadTaskIds: sharedUnread } = useMobileTaskSections(sharedTasks)
	const pendingApprovals = useMobilePendingApprovals()
	const { approve } = useApprovalActions()
	const [approvingTaskId, setApprovingTaskId] = useState<string | null>(null)

	const handleTabChange = (nextTab: MobileTasksTab) => {
		navigate({ to: routeTo, search: { tab: nextTab === 'shared-tasks' ? 'shared-tasks' : 'tasks' } })
	}

	const handleTaskClick = (taskId: string) => {
		navigate({ to: '/tasks/$taskId', params: { taskId } })
	}

	const handleNewTask = () => {
		navigate({ to: '/tasks/new' })
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

	const renderSections = (groups: MobileTaskGroups, unreadTaskIds: Set<string>) => (
		<div>
			{SECTION_META.map(({ key, id, label }) => {
				const tasks = groups[key]
				if (tasks.length === 0) return null
				return (
					<section key={id}>
						<MobileTaskSectionHeader
							label={label}
							count={tasks.length}
							tone={id === 'needs_you' ? 'attention' : 'default'}
						/>
						<div className="divide-y divide-border">
							{tasks.map((task) => {
								const approval = id === 'needs_you' ? pendingApprovals.get(task.id) : undefined
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

	const myHasTasks = myTasks.length > 0

	return (
		<MobileAppLayout>
			<Tabs
				value={activeTab}
				onValueChange={(value) => handleTabChange(value as MobileTasksTab)}
				className="flex min-h-0 flex-1 flex-col gap-0"
			>
				<div className="shrink-0 border-b border-border px-4 py-2">
					<TabsList className="grid h-10 w-full grid-cols-2">
						<TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
						<TabsTrigger value="shared-tasks">Shared Tasks</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="my-tasks" className="mt-0 min-h-0 flex-1 overflow-y-auto overscroll-contain">
					{myHasTasks ? (
						renderSections(myGroups, myUnread)
					) : (
						<div className="flex flex-col items-center justify-center h-full px-6 text-center gap-4">
							<p className="text-sm text-muted-foreground">No tasks yet.</p>
							<Button onClick={handleNewTask} size="sm">
								<Plus className="h-4 w-4 mr-1" />
								New Task
							</Button>
						</div>
					)}
				</TabsContent>

				<TabsContent value="shared-tasks" className="mt-0 min-h-0 flex-1 overflow-y-auto overscroll-contain">
					{sharedTasks.length > 0 ? (
						renderSections(sharedGroups, sharedUnread)
					) : (
						<div className="flex flex-col items-center justify-center h-full px-6 text-center gap-2">
							<Users className="h-8 w-8 text-muted-foreground opacity-50" />
							<p className="text-sm font-medium">No shared tasks</p>
							<p className="text-sm text-muted-foreground">
								Tasks shared by your teammates will appear here
							</p>
						</div>
					)}
				</TabsContent>
			</Tabs>

			{activeTab === 'my-tasks' && myHasTasks && (
				<div className="shrink-0 px-4 py-3 border-t border-border">
					<Button onClick={handleNewTask} className="w-full" size="sm">
						<Plus className="h-4 w-4 mr-1" />
						New Task
					</Button>
				</div>
			)}
		</MobileAppLayout>
	)
}
