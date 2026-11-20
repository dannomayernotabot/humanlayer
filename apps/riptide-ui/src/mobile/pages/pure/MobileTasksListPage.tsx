import { Button } from '@humanlayer/ui/components/button'
import type { SessionLabel } from '@humanlayer/ui/components/session-label-badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@humanlayer/ui/components/tabs'
import { Plus, Users } from 'lucide-react'
import type { FC } from 'react'

import { MobileTaskRow, type TaskStatus } from '@/mobile/components/pure/MobileTaskRow'
import { MobileTaskSectionHeader } from '@/mobile/components/pure/MobileTaskSectionHeader'
import { MobileAppLayout } from '@/mobile/layouts/MobileAppLayout'
import type { MobileTaskBucket } from '@/mobile/lib/groupMobileTasks'

export type MobileTasksTab = 'my-tasks' | 'shared-tasks'

export interface MobileTasksListTask {
	taskId: string
	taskName: string
	label?: SessionLabel
	sessionCount: number
	status: TaskStatus
	isUnread?: boolean
}

export interface MobileTasksListSection {
	id: MobileTaskBucket
	label: string
	tasks: MobileTasksListTask[]
}

export interface MobileTasksListPageProps {
	mySections: MobileTasksListSection[]
	sharedSections: MobileTasksListSection[]
	activeTab: MobileTasksTab
	onTabChange: (tab: MobileTasksTab) => void
	onTaskClick: (taskId: string) => void
	onNewTask?: () => void
}

function hasAnyTask(sections: MobileTasksListSection[]): boolean {
	return sections.some((section) => section.tasks.length > 0)
}

function renderSections(sections: MobileTasksListSection[], onTaskClick: (taskId: string) => void) {
	return (
		<div>
			{sections
				.filter((section) => section.tasks.length > 0)
				.map((section) => (
					<section key={section.id}>
						<MobileTaskSectionHeader
							label={section.label}
							count={section.tasks.length}
							tone={section.id === 'needs_you' ? 'attention' : 'default'}
						/>
						<div className="divide-y divide-border">
							{section.tasks.map((task) => (
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
							))}
						</div>
					</section>
				))}
		</div>
	)
}

/**
 * Mobile tasks list page — My Tasks / Shared Tasks tab toggle + a scrollable
 * list grouped into Needs you / Running / Recent sections for the active tab.
 */
export const MobileTasksListPage: FC<MobileTasksListPageProps> = ({
	mySections,
	sharedSections,
	activeTab,
	onTabChange,
	onTaskClick,
	onNewTask,
}) => {
	return (
		<MobileAppLayout>
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

				<TabsContent value="my-tasks" className="mt-0 min-h-0 flex-1 overflow-y-auto overscroll-contain">
					{hasAnyTask(mySections) ? (
						renderSections(mySections, onTaskClick)
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

				<TabsContent value="shared-tasks" className="mt-0 min-h-0 flex-1 overflow-y-auto overscroll-contain">
					{hasAnyTask(sharedSections) ? (
						renderSections(sharedSections, onTaskClick)
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
				<div className="shrink-0 px-4 py-3 border-t border-border">
					<Button onClick={onNewTask} className="w-full" size="sm">
						<Plus className="h-4 w-4 mr-1" />
						New Task
					</Button>
				</div>
			)}
		</MobileAppLayout>
	)
}
