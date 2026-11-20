import { describe, expect, it } from 'vitest'

import type { TaskWithActivity } from '@/hooks/useTasksByRecency'

import { bucketForSessions, groupMobileTasks, type MobileSessionStatusRow } from './groupMobileTasks'

function session(overrides: Partial<MobileSessionStatusRow> = {}): MobileSessionStatusRow {
	return { id: 's1', task_id: 't1', status: 'idle', last_activity_at: 0, ...overrides }
}

function task(id: string): TaskWithActivity {
	return {
		id,
		name: `task ${id}`,
		created_at: null,
		updated_at: null,
		archived: false,
		is_draft: false,
		team_id: null,
		project_id: null,
		organization_id: 'org',
		default_working_directory: null,
		resource_owner_user_id: 'user',
		latestSessionActivity: null,
		sessionCount: 0,
		workflowSessions: [],
	}
}

describe('bucketForSessions', () => {
	it('is needs_you when any session needs approval', () => {
		expect(bucketForSessions([session({ status: 'running' }), session({ status: 'needs_approval' })])).toBe(
			'needs_you',
		)
	})

	it('is needs_you when the most recent session failed', () => {
		expect(
			bucketForSessions([
				session({ status: 'running', last_activity_at: 10 }),
				session({ status: 'failed', last_activity_at: 20 }),
			]),
		).toBe('needs_you')
	})

	it('is not needs_you when an older session failed but the latest is running', () => {
		expect(
			bucketForSessions([
				session({ status: 'failed', last_activity_at: 10 }),
				session({ status: 'running', last_activity_at: 20 }),
			]),
		).toBe('running')
	})

	it('is needs_you for a lost session', () => {
		expect(bucketForSessions([session({ status: 'lost' })])).toBe('needs_you')
	})

	it('is running for active and launching sessions', () => {
		expect(bucketForSessions([session({ status: 'running' })])).toBe('running')
		expect(bucketForSessions([session({ status: 'launching' })])).toBe('running')
		expect(bucketForSessions([session({ status: 'interrupt_requested' })])).toBe('running')
	})

	it('is recent when idle or with no sessions', () => {
		expect(bucketForSessions([session({ status: 'idle' })])).toBe('recent')
		expect(bucketForSessions([])).toBe('recent')
	})

	it('prioritises needs_you over running', () => {
		expect(bucketForSessions([session({ status: 'running' }), session({ status: 'lost' })])).toBe('needs_you')
	})
})

describe('groupMobileTasks', () => {
	it('splits tasks into sections and preserves input (recency) order', () => {
		const tasks = [task('a'), task('b'), task('c'), task('d')]
		const byTask = new Map<string, MobileSessionStatusRow[]>([
			['a', [session({ task_id: 'a', status: 'running' })]],
			['b', [session({ task_id: 'b', status: 'needs_approval' })]],
			['c', [session({ task_id: 'c', status: 'idle' })]],
			// 'd' has no sessions → recent
		])

		const groups = groupMobileTasks(tasks, byTask)

		expect(groups.needsYou.map((t) => t.id)).toEqual(['b'])
		expect(groups.running.map((t) => t.id)).toEqual(['a'])
		expect(groups.recent.map((t) => t.id)).toEqual(['c', 'd'])
	})
})
