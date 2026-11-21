import type { Meta, StoryObj } from '@storybook/react'

import { MobileMePanel } from './MobileMePanel'

const meta: Meta<typeof MobileMePanel> = {
	title: 'Mobile/MobileMePanel',
	component: MobileMePanel,
	parameters: {
		layout: 'fullscreen',
		viewport: { defaultViewport: 'mobile1' },
	},
	args: {
		onOpenSettings: () => {},
		onSignOut: () => {},
	},
}

export default meta

type Story = StoryObj<typeof MobileMePanel>

export const Default: Story = {
	args: {
		name: 'Ada Lovelace',
		email: 'ada@example.com',
	},
}

export const EmailOnly: Story = {
	args: {
		name: null,
		email: 'ada@example.com',
	},
}
