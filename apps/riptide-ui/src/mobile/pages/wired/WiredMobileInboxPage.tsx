import { Inbox } from 'lucide-react'

import { MobileScreenHeader } from '@/mobile/components/pure/MobileScreenHeader'
import { WiredMobileTabBar } from '@/mobile/components/wired/WiredMobileTabBar'
import { WiredMobileTaskSections } from '@/mobile/components/wired/WiredMobileTaskSections'
import { useMobileMyTaskSections } from '@/mobile/hooks/useMobileMyTaskSections'
import { MobileAppLayout } from '@/mobile/layouts/MobileAppLayout'

/**
 * Mobile Inbox — everything across your tasks that is waiting on you:
 * approvals (with inline Approve) plus failed or lost sessions.
 */
export function WiredMobileInboxPage() {
	const { groups, unreadTaskIds } = useMobileMyTaskSections()
	const count = groups.needsYou.length

	return (
		<MobileAppLayout>
			<MobileScreenHeader title="Inbox" count={count} />
			<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
				{count === 0 ? (
					<div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
						<Inbox className="h-8 w-8 text-muted-foreground opacity-50" />
						<p className="text-sm font-medium">Nothing needs you right now</p>
						<p className="text-sm text-muted-foreground">
							Approvals and failed sessions from your tasks show up here.
						</p>
					</div>
				) : (
					<WiredMobileTaskSections
						groups={groups}
						unreadTaskIds={unreadTaskIds}
						sections={['needsYou']}
						showHeaders={false}
					/>
				)}
			</div>
			<WiredMobileTabBar active="inbox" />
		</MobileAppLayout>
	)
}
