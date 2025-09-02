import { type ButtonProps } from "../../types/ui";
import { cn } from "../../lib/utils";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow hover:bg-primary/90",
				destructive:
					"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
				outline:
					"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
				secondary:
					"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				primary: "bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500",
				danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-10 rounded-md px-8",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ShadcnButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const ShadcnButton = forwardRef<HTMLButtonElement, ShadcnButtonProps>(
	({ className, variant, size, asChild: _asChild = false, ...props }, ref) => {
		return (
			<button
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
ShadcnButton.displayName = "Button";

// 既存のButtonコンポーネントを維持
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
			"bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500",
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

// shadcn/ui向けのエクスポート
export { ShadcnButton, buttonVariants };
export default ShadcnButton;
