import { describeToolInput, formatToolName } from '@/lib/approvals/describeApprovalRequest'

import type { NotificationRow } from '../notification-row'
import type { RowContext } from './row-context'
import { sessionName, toMillis } from './row-text'

export function approvalRows(context: RowContext): NotificationRow[] {
	const rows: NotificationRow[] = []
	for (const approval of context.sources.approvals) {
		if (approval.status !== 'pending') continue
		const session = context.session(approval.session_id)
		if (!session || session.created_by !== context.userId || session.archived) continue
		const toolName = approval.tool_name ? formatToolName(approval.tool_name) : 'a tool'
		const input = describeToolInput(approval.tool_input)
		rows.push({
			key: `approval:${approval.id}`,
			kind: 'approval',
			at: toMillis(approval.created_at),
			actors: [{ agent: true }],
			count: 1,
			subject: sessionName(session),
			taskName: context.taskName(session.task_id),
			detail: input ? `${toolName} · ${input}` : toolName,
			destination: { kind: 'session', sessionId: session.id },
			dismissible: false,
		})
	}
	return rows
}
