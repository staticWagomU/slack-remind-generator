import { type ButtonProps } from "../../types/ui";
import { cn } from "../../lib/utils";

export function Button({
	variant = "primary",
	size = "md",
	disabled = false,
	loading = false,
	children,
	onClick,
	type = "button",
}: ButtonProps) {
	const baseStyles =
		"inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

	const variantStyles = {
		primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
		secondary:
			"bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
		danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
	};

	const sizeStyles = {
		sm: "px-3 py-1.5 text-sm rounded",
		md: "px-4 py-2 text-sm rounded-md",
		lg: "px-6 py-3 text-base rounded-lg",
	};

	return (
		<button
			type={type}
			disabled={disabled || loading}
			onClick={onClick}
			className={cn(baseStyles, variantStyles[variant], sizeStyles[size])}
		>
			{loading && (
				<svg
					className="animate-spin -ml-1 mr-2 h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			)}
			{children}
		</button>
	);
}
