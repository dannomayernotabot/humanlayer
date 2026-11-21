import { useNavigate } from '@tanstack/react-router'

import { type MobileTab, MobileTabBar } from '@/mobile/components/pure/MobileTabBar'
import { useMobileMyTaskSections } from '@/mobile/hooks/useMobileMyTaskSections'

/**
 * Bottom navigation for the mobile tab screens. The Inbox dot lights up when any
 * of your tasks needs you (pending approval, failed, or lost), unless you're
 * already looking at the Inbox.
 */
export function WiredMobileTabBar({ active }: { active: MobileTab }) {
	const navigate = useNavigate()
	const { groups } = useMobileMyTaskSections()

	const handleSelect = (tab: MobileTab) => {
		if (tab === active) return
		if (tab === 'tasks') navigate({ to: '/' })
		else if (tab === 'inbox') navigate({ to: '/inbox' })
		else navigate({ to: '/me' })
	}

	return (
		<MobileTabBar
			active={active}
			inboxHasAttention={active !== 'inbox' && groups.needsYou.length > 0}
			onSelect={handleSelect}
		/>
	)
}
