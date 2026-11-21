import { Inbox } from 'lucide-react'
import type { FC } from 'react'

import { MobileScreenHeader } from '@/mobile/components/pure/MobileScreenHeader'
import { type MobileTab, MobileTabBar } from '@/mobile/components/pure/MobileTabBar'
import { type MobileTasksListTask, MobileTaskSectionList } from '@/mobile/components/pure/MobileTaskSectionList'
import { MobileAppLayout } from '@/mobile/layouts/MobileAppLayout'

export interface MobileInboxPageProps {
	/** Tasks waiting on you — approvals render as cards, the rest as rows. */
	tasks: MobileTasksListTask[]
	onTaskClick: (taskId: string) => void
	onApprove?: (taskId: string) => void
	approvingTaskId?: string | null
	onTabSelect?: (tab: MobileTab) => void
}

/** Mobile Inbox — everything across your tasks that is waiting on you. */
export const MobileInboxPage: FC<MobileInboxPageProps> = ({
	tasks,
	onTaskClick,
	onApprove,
	approvingTaskId,
	onTabSelect,
}) => {
	return (
		<MobileAppLayout>
			<MobileScreenHeader title="Inbox" count={tasks.length} />
			<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
				{tasks.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
						<Inbox className="h-8 w-8 text-muted-foreground opacity-50" />
						<p className="text-sm font-medium">Nothing needs you right now</p>
						<p className="text-sm text-muted-foreground">
							Approvals and failed sessions from your tasks show up here.
						</p>
					</div>
				) : (
					<MobileTaskSectionList
						sections={[{ id: 'needs_you', label: 'Needs you', tasks }]}
						onTaskClick={onTaskClick}
						onApprove={onApprove}
						approvingTaskId={approvingTaskId}
						showHeaders={false}
					/>
				)}
			</div>
			<MobileTabBar active="inbox" onSelect={onTabSelect ?? (() => {})} />
		</MobileAppLayout>
	)
}
