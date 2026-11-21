import { useIsMobile } from '@humanlayer/ui/hooks/use-mobile'
import { createFileRoute, Navigate } from '@tanstack/react-router'

import { WiredMobileInboxPage } from '@/mobile/pages/wired/WiredMobileInboxPage'

export const Route = createFileRoute('/_app/inbox')({
	component: InboxRoute,
})

/** The Inbox is a mobile tab screen; desktop already surfaces this in the sidebar and notifications. */
function InboxRoute() {
	const isMobile = useIsMobile()
	if (!isMobile) return <Navigate to="/" />
	return <WiredMobileInboxPage />
}
