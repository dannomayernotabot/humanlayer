import type { Meta, StoryObj } from '@storybook/react'
import {
	MobileTasksListPage,
	type MobileTasksListSection,
	type MobileTasksListTask,
} from './MobileTasksListPage'

const needsYou: MobileTasksListTask[] = [
	{
		taskId: 'task-approval',
		taskName: 'Wire mobile bottom navigation',
		label: { name: 'rpi:implementation', title: 'implementation' },
		sessionCount: 2,
		status: 'needs_approval',
		isUnread: true,
		approval: {
			toolLabel: 'Bash',
			inputPreview: 'bun --bun run typecheck --filter @humanlayer/riptide-ui',
		},
	},
	{
		taskId: 'task-approval-2',
		taskName: 'Add storybook stories for mobile rows',
		sessionCount: 1,
		status: 'needs_approval',
		approval: {
			toolLabel: 'Edit',
			inputPreview: 'apps/riptide-ui/src/mobile/components/pure/MobileTabBar.tsx',
			extraCount: 2,
		},
	},
	{
		taskId: 'task-failed',
		taskName: 'Update billing webhook handler',
		label: { name: 'rpi:research', title: 'research' },
		sessionCount: 1,
		status: 'failed',
	},
]

const running: MobileTasksListTask[] = [
	{
		taskId: 'task-run-1',
		taskName: 'Fix safe-area insets on notched phones',
		label: { name: 'rpi:implementation', title: 'implementation' },
		sessionCount: 1,
		status: 'running',
		isUnread: true,
	},
	{
		taskId: 'task-run-2',
		taskName: 'Refactor the session composer',
		sessionCount: 3,
		status: 'running',
	},
]

const recent: MobileTasksListTask[] = [
	{
		taskId: 'task-recent-1',
		taskName: 'Improve onboarding flow',
		label: { name: 'rpi:plan', title: 'plan' },
		sessionCount: 0,
		status: 'has_next_step',
	},
	{
		taskId: 'task-recent-2',
		taskName: 'Migrate oRPC procedure to Effect',
		sessionCount: 2,
		status: 'idle',
	},
]

const mySections: MobileTasksListSection[] = [
	{ id: 'needs_you', label: 'Needs you', tasks: needsYou },
	{ id: 'running', label: 'Running', tasks: running },
	{ id: 'recent', label: 'Recent', tasks: recent },
]

const sharedSections: MobileTasksListSection[] = [
	{
		id: 'needs_you',
		label: 'Needs you',
		tasks: [
			{
				taskId: 'task-shared-1',
				taskName: 'Review teammate migration',
				label: { name: 'rpi:research', title: 'research' },
				sessionCount: 2,
				status: 'needs_approval',
			},
		],
	},
	{
		id: 'recent',
		label: 'Recent',
		tasks: [
			{ taskId: 'task-shared-2', taskName: 'Refresh landing page copy', sessionCount: 1, status: 'idle' },
		],
	},
]

const meta: Meta<typeof MobileTasksListPage> = {
	title: 'Mobile/Pages/MobileTasksListPage',
	component: MobileTasksListPage,
	parameters: {
		layout: 'fullscreen',
		viewport: { defaultViewport: 'mobile1' },
	},
	args: {
		onTaskClick: () => {},
		onTabChange: () => {},
		onApprove: () => {},
		onNewTask: () => {},
	},
}

export default meta

type Story = StoryObj<typeof MobileTasksListPage>

export const Empty: Story = {
	args: {
		activeTab: 'my-tasks',
		mySections: [],
		sharedSections: [],
	},
}

export const Grouped: Story = {
	args: {
		activeTab: 'my-tasks',
		mySections,
		sharedSections,
	},
}

export const SharedTasks: Story = {
	args: {
		activeTab: 'shared-tasks',
		mySections,
		sharedSections,
	},
}

export const SharedTasksEmpty: Story = {
	args: {
		activeTab: 'shared-tasks',
		mySections,
		sharedSections: [],
	},
}
