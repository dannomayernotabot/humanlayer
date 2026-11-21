import { Button } from '@humanlayer/ui/components/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@humanlayer/ui/components/tabs'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@workos-inc/authkit-react'
import { Plus, Users } from 'lucide-react'
import { useMemo } from 'react'

import type { SessionsRouteTab, SessionsRouteTo } from '@/components/sessions-page/sessionsRoute'
import { useTasksByRecency } from '@/hooks/useTasksByRecency'
import { MobileNewTaskButton } from '@/mobile/components/pure/MobileNewTaskButton'
import { WiredMobileTabBar } from '@/mobile/components/wired/WiredMobileTabBar'
import { WiredMobileTaskSections } from '@/mobile/components/wired/WiredMobileTaskSections'
import { useMobileMyTaskSections } from '@/mobile/hooks/useMobileMyTaskSections'
import { useMobileTaskSections } from '@/mobile/hooks/useMobileTaskSections'
import { MobileAppLayout } from '@/mobile/layouts/MobileAppLayout'
import type { MobileTasksTab } from '@/mobile/pages/pure/MobileTasksListPage'

/**
 * Wired mobile tasks list page.
 * Two tabs synced to the same `tab` search param the desktop sessions page uses:
 *   My Tasks — same ownership filter as the desktop tasks tab
 *   Shared Tasks — teammates' tasks, same filter as the desktop shared tasks tab
 * Within each tab, tasks are grouped into Needs you / Running / Recent sections.
 * Bottom tab bar navigates to Inbox and Me; the floating + starts a task.
 */
export function WiredMobileTasksListPage({ tab, routeTo }: { tab: SessionsRouteTab; routeTo: SessionsRouteTo }) {
	const navigate = useNavigate()
	const { user } = useAuth()

	const activeTab: MobileTasksTab = tab === 'shared-tasks' ? 'shared-tasks' : 'my-tasks'

	// Same filter as desktop sessions list tasks tab:
	// owned tasks + shared tasks where the current user has a session
	const { groups: myGroups, unreadTaskIds: myUnread, taskCount: myTaskCount } = useMobileMyTaskSections()

	// Same filter as desktop shared tasks tab:
	// all visible tasks, minus the ones the current user owns
	const { tasks: allTasks } = useTasksByRecency({ ownedOnly: false, userId: user?.id })
	const sharedTasks = useMemo(() => {
		if (!user?.id) return []
		return allTasks.filter((t) => t.resource_owner_user_id !== user.id)
	}, [allTasks, user?.id])
	const { groups: sharedGroups, unreadTaskIds: sharedUnread } = useMobileTaskSections(sharedTasks)

	const handleTabChange = (nextTab: MobileTasksTab) => {
		navigate({ to: routeTo, search: { tab: nextTab === 'shared-tasks' ? 'shared-tasks' : 'tasks' } })
	}

	const handleNewTask = () => {
		navigate({ to: '/tasks/new' })
	}

	return (
		<MobileAppLayout>
			<div className="relative flex min-h-0 flex-1 flex-col">
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

					<TabsContent
						value="my-tasks"
						className="mt-0 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-20"
					>
						{myTaskCount > 0 ? (
							<WiredMobileTaskSections groups={myGroups} unreadTaskIds={myUnread} />
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

					<TabsContent
						value="shared-tasks"
						className="mt-0 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-20"
					>
						{sharedTasks.length > 0 ? (
							<WiredMobileTaskSections groups={sharedGroups} unreadTaskIds={sharedUnread} />
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

				{activeTab === 'my-tasks' && myTaskCount > 0 && <MobileNewTaskButton onClick={handleNewTask} />}
			</div>

			<WiredMobileTabBar active="tasks" />
		</MobileAppLayout>
	)
}
