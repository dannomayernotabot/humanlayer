import { useIsMobile } from '@humanlayer/ui/hooks/use-mobile'
import { createFileRoute, Navigate } from '@tanstack/react-router'

import { WiredMobileMePage } from '@/mobile/pages/wired/WiredMobileMePage'

export const Route = createFileRoute('/_app/me')({
	component: MeRoute,
})

/** The Me page is a mobile tab screen; on desktop, account controls live in settings. */
function MeRoute() {
	const isMobile = useIsMobile()
	if (!isMobile) return <Navigate to="/settings" />
	return <WiredMobileMePage />
}
