import type { Meta, StoryObj } from '@storybook/react'

import { MobileNeedsYouCard } from './MobileNeedsYouCard'

const meta: Meta<typeof MobileNeedsYouCard> = {
	title: 'Mobile/MobileNeedsYouCard',
	component: MobileNeedsYouCard,
	parameters: {
		layout: 'fullscreen',
		viewport: { defaultViewport: 'mobile1' },
	},
	args: {
		onReply: () => {},
		onApprove: () => {},
	},
}

export default meta

type Story = StoryObj<typeof MobileNeedsYouCard>

export const Command: Story = {
	args: {
		taskName: 'Wire mobile bottom navigation',
		toolLabel: 'Bash',
		inputPreview: 'bun --bun run typecheck --filter @humanlayer/riptide-ui',
		isUnread: true,
	},
}

export const EditFile: Story = {
	args: {
		taskName: 'Update billing webhook handler',
		toolLabel: 'Edit',
		inputPreview: 'apps/riptide-api/src/effects/services/billing-checkout-completion.live.ts',
	},
}

export const MultiplePending: Story = {
	args: {
		taskName: 'Refactor the session composer',
		toolLabel: 'linear:create-issue',
		inputPreview: 'Split composer into pure + wired',
		extraCount: 2,
	},
}

export const Approving: Story = {
	args: {
		taskName: 'Wire mobile bottom navigation',
		toolLabel: 'Bash',
		inputPreview: 'git push -u origin claude/mobile-ui',
		approving: true,
	},
}

export const HostOffline: Story = {
	args: {
		taskName: 'Update billing webhook handler',
		toolLabel: 'Bash',
		inputPreview: 'bun --bun run test:local:services',
		approveDisabled: true,
		approveDisabledReason: 'Host offline',
	},
}
