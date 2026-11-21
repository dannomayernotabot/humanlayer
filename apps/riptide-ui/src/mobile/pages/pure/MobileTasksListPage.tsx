import { Button } from '@humanlayer/ui/components/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@humanlayer/ui/components/tabs'
import { Plus, Users } from 'lucide-react'
import type { FC } from 'react'

import { MobileNewTaskButton } from '@/mobile/components/pure/MobileNewTaskButton'
import { type MobileTab, MobileTabBar } from '@/mobile/components/pure/MobileTabBar'
import { type MobileTasksListSection, MobileTaskSectionList } from '@/mobile/components/pure/MobileTaskSectionList'
import { MobileAppLayout } from '@/mobile/layouts/MobileAppLayout'

export type {
	MobileTaskApproval,
	MobileTasksListSection,
	MobileTasksListTask,
} from '@/mobile/components/pure/MobileTaskSectionList'

export type MobileTasksTab = 'my-tasks' | 'shared-tasks'

export interface MobileTasksListPageProps {
	mySections: MobileTasksListSection[]
	sharedSections: MobileTasksListSection[]
	activeTab: MobileTasksTab
	onTabChange: (tab: MobileTasksTab) => void
	onTaskClick: (taskId: string) => void
	/** Resolve a task's headline pending approval from its Needs-you card. */
	onApprove?: (taskId: string) => void
	/** Task whose approval is currently being resolved. */
	approvingTaskId?: string | null
	onNewTask?: () => void
	/** Bottom tab bar navigation. */
	onTabSelect?: (tab: MobileTab) => void
	inboxHasAttention?: boolean
}

function hasAnyTask(sections: MobileTasksListSection[]): boolean {
	return sections.some((section) => section.tasks.length > 0)
}

/**
 * Mobile tasks list page — My Tasks / Shared Tasks toggle, a scrollable list
 * grouped into Needs you / Running / Recent, a floating + for new tasks, and the
 * bottom tab bar.
 */
export const MobileTasksListPage: FC<MobileTasksListPageProps> = ({
	mySections,
	sharedSections,
	activeTab,
	onTabChange,
	onTaskClick,
	onApprove,
	approvingTaskId,
	onNewTask,
	onTabSelect,
	inboxHasAttention = false,
}) => {
	return (
		<MobileAppLayout>
			<div className="relative flex min-h-0 flex-1 flex-col">
				<Tabs
					value={activeTab}
					onValueChange={(value) => onTabChange(value as MobileTasksTab)}
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
						{hasAnyTask(mySections) ? (
							<MobileTaskSectionList
								sections={mySections}
								onTaskClick={onTaskClick}
								onApprove={onApprove}
								approvingTaskId={approvingTaskId}
							/>
						) : (
							<div className="flex flex-col items-center justify-center h-full px-6 text-center gap-4">
								<p className="text-sm text-muted-foreground">No tasks yet.</p>
								{onNewTask && (
									<Button onClick={onNewTask} size="sm">
										<Plus className="h-4 w-4 mr-1" />
										New Task
									</Button>
								)}
							</div>
						)}
					</TabsContent>

					<TabsContent
						value="shared-tasks"
						className="mt-0 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-20"
					>
						{hasAnyTask(sharedSections) ? (
							<MobileTaskSectionList
								sections={sharedSections}
								onTaskClick={onTaskClick}
								onApprove={onApprove}
								approvingTaskId={approvingTaskId}
							/>
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

				{activeTab === 'my-tasks' && hasAnyTask(mySections) && onNewTask && (
					<MobileNewTaskButton onClick={onNewTask} />
				)}
			</div>

			<MobileTabBar active="tasks" inboxHasAttention={inboxHasAttention} onSelect={onTabSelect ?? (() => {})} />
		</MobileAppLayout>
	)
}
