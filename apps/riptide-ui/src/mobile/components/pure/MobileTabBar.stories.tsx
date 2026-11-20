import type { Meta, StoryObj } from '@storybook/react'

import { MobileTabBar } from './MobileTabBar'

const meta: Meta<typeof MobileTabBar> = {
	title: 'Mobile/MobileTabBar',
	component: MobileTabBar,
	parameters: {
		layout: 'fullscreen',
		viewport: { defaultViewport: 'mobile1' },
	},
	args: {
		onSelect: () => {},
	},
}

export default meta

type Story = StoryObj<typeof MobileTabBar>

export const TasksActive: Story = {
	args: {
		active: 'tasks',
		inboxHasAttention: true,
	},
}

export const InboxActive: Story = {
	args: {
		active: 'inbox',
		inboxHasAttention: false,
	},
}

export const MeActive: Story = {
	args: {
		active: 'me',
	},
}
