import { Plus } from 'lucide-react'
import type { FC } from 'react'

export interface MobileNewTaskButtonProps {
	onClick: () => void
}

/**
 * Floating "+" button for starting a task. Sits above the tab bar so the screen
 * doesn't need a second bottom bar. Position it inside a `relative` container.
 */
export const MobileNewTaskButton: FC<MobileNewTaskButtonProps> = ({ onClick }) => {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label="New task"
			className="absolute bottom-4 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-background shadow-lg shadow-accent/25 transition-transform active:scale-95"
		>
			<Plus className="h-6 w-6" strokeWidth={2.25} />
		</button>
	)
}
