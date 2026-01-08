/**
 * @file Toast.tsx
 * @description Simple toast notification component for user feedback
 * @TDD-Phase GREEN (ST-4.3.1-4)
 */

import { useEffect } from "react";
import { cn } from "../../lib/utils";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
	message: string;
	type: ToastType;
	onClose: () => void;
	duration?: number;
}

const TOAST_ICONS = {
	success: CheckCircle,
	error: XCircle,
	info: AlertCircle,
};

const TOAST_STYLES = {
	success: "bg-green-50 text-green-900 border-green-200",
	error: "bg-red-50 text-red-900 border-red-200",
	info: "bg-blue-50 text-blue-900 border-blue-200",
};

const ICON_STYLES = {
	success: "text-green-600",
	error: "text-red-600",
	info: "text-blue-600",
};

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
	const Icon = TOAST_ICONS[type];

	useEffect(() => {
		if (duration > 0) {
			const timer = setTimeout(onClose, duration);
			return () => clearTimeout(timer);
		}
	}, [duration, onClose]);

	return (
		<div
			role="alert"
			aria-live="polite"
			data-testid="toast"
			data-toast-type={type}
			className={cn(
				"flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg",
				"animate-in slide-in-from-top-5 fade-in duration-300",
				TOAST_STYLES[type],
			)}
		>
			<Icon className={cn("h-5 w-5 flex-shrink-0", ICON_STYLES[type])} />
			<p className="flex-1 text-sm font-medium">{message}</p>
			<button
				onClick={onClose}
				className="flex-shrink-0 hover:opacity-70 transition-opacity"
				aria-label="閉じる"
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	);
}
