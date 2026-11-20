import { firstLine } from '../notifications/rows/row-text'

/** Turn an `mcp__server__tool` name into the friendlier `server:tool`. */
export function formatToolName(toolName: string): string {
	if (!toolName.startsWith('mcp__')) return toolName
	const parts = toolName.split('__')
	return parts.length >= 3 ? `${parts[1]}:${parts.slice(2).join('__')}` : toolName
}

/** A one-line, human-readable preview of a tool call's input. */
export function describeToolInput(input: unknown): string | null {
	if (input === null || input === undefined) return null
	if (typeof input === 'object' && 'command' in input && typeof input.command === 'string') {
		return firstLine(input.command)
	}
	if (typeof input === 'object' && 'file_path' in input && typeof input.file_path === 'string') {
		return input.file_path
	}
	return firstLine(JSON.stringify(input))
}

export interface ApprovalRequestSummary {
	/** Friendly tool name, e.g. "Bash" or "linear:create-issue". */
	toolLabel: string
	/** One-line preview of the tool input, or null when there is nothing useful. */
	inputPreview: string | null
}

/** Summarise a pending approval for compact display (list cards, notifications). */
export function describeApprovalRequest(approval: {
	tool_name?: string | null
	tool_input?: unknown
}): ApprovalRequestSummary {
	return {
		toolLabel: approval.tool_name ? formatToolName(approval.tool_name) : 'a tool',
		inputPreview: describeToolInput(approval.tool_input),
	}
}
