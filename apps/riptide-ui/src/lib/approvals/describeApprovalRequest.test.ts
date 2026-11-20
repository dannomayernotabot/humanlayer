import { describe, expect, it } from 'vitest'

import { describeApprovalRequest, describeToolInput, formatToolName } from './describeApprovalRequest'

describe('formatToolName', () => {
	it('passes plain tool names through', () => {
		expect(formatToolName('Bash')).toBe('Bash')
	})

	it('shortens mcp tool names to server:tool', () => {
		expect(formatToolName('mcp__linear__create_issue')).toBe('linear:create_issue')
		expect(formatToolName('mcp__github__pull_request__read')).toBe('github:pull_request__read')
	})
})

describe('describeToolInput', () => {
	it('returns null for empty input', () => {
		expect(describeToolInput(null)).toBeNull()
		expect(describeToolInput(undefined)).toBeNull()
	})

	it('prefers a command, first line only', () => {
		expect(describeToolInput({ command: 'bun run typecheck\n&& echo done' })).toBe('bun run typecheck')
	})

	it('falls back to a file path', () => {
		expect(describeToolInput({ file_path: 'src/app.ts' })).toBe('src/app.ts')
	})

	it('serialises other objects', () => {
		expect(describeToolInput({ url: 'https://example.com' })).toContain('example.com')
	})
})

describe('describeApprovalRequest', () => {
	it('summarises tool name and input', () => {
		expect(describeApprovalRequest({ tool_name: 'Bash', tool_input: { command: 'ls -la' } })).toEqual({
			toolLabel: 'Bash',
			inputPreview: 'ls -la',
		})
	})

	it('defaults the label when no tool name is present', () => {
		expect(describeApprovalRequest({ tool_input: null })).toEqual({
			toolLabel: 'a tool',
			inputPreview: null,
		})
	})
})
