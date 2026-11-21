import type { Meta, StoryObj } from '@storybook/react'

import { MobileInboxPage } from './MobileInboxPage'

const meta: Meta<typeof MobileInboxPage> = {
	title: 'Mobile/Pages/MobileInboxPage',
	component: MobileInboxPage,
	parameters: {
		layout: 'fullscreen',
		viewport: { defaultViewport: 'mobile1' },
	},
	args: {
		onTaskClick: () => {},
		onApprove: () => {},
		onTabSelect: () => {},
	},
}

export default meta

type Story = StoryObj<typeof MobileInboxPage>

export const Waiting: Story = {
	args: {
		tasks: [
			{
				taskId: 'task-approval',
				taskName: 'Wire mobile bottom navigation',
				sessionCount: 2,
				status: 'needs_approval',
				isUnread: true,
				approval: { toolLabel: 'Bash', inputPreview: 'bun --bun run typecheck --filter @humanlayer/riptide-ui' },
			},
			{
				taskId: 'task-approval-2',
				taskName: 'Add storybook stories for mobile rows',
				sessionCount: 1,
				status: 'needs_approval',
				approval: {
					toolLabel: 'Edit',
					inputPreview: 'apps/riptide-ui/src/mobile/components/pure/MobileTabBar.tsx',
					extraCount: 1,
				},
			},
			{
				taskId: 'task-failed',
				taskName: 'Update billing webhook handler',
				label: { name: 'rpi:research', title: 'research' },
				sessionCount: 1,
				status: 'failed',
			},
		],
	},
}

export const Empty: Story = {
	args: {
		tasks: [],
	},
}
