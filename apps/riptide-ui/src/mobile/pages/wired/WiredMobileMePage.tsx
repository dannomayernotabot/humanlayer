import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@workos-inc/authkit-react'

import { MobileMePanel } from '@/mobile/components/pure/MobileMePanel'
import { MobileScreenHeader } from '@/mobile/components/pure/MobileScreenHeader'
import { WiredMobileTabBar } from '@/mobile/components/wired/WiredMobileTabBar'
import { MobileAppLayout } from '@/mobile/layouts/MobileAppLayout'

/** Mobile Me tab — the signed-in account, a link to settings, and sign out. */
export function WiredMobileMePage() {
	const navigate = useNavigate()
	const { user, signOut } = useAuth()

	const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')

	return (
		<MobileAppLayout>
			<MobileScreenHeader title="Me" />
			<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
				<MobileMePanel
					name={fullName || null}
					email={user?.email ?? null}
					onOpenSettings={() => navigate({ to: '/settings' })}
					onSignOut={() => signOut({ returnTo: window.location.origin })}
				/>
			</div>
			<WiredMobileTabBar active="me" />
		</MobileAppLayout>
	)
}
