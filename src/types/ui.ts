export interface ButtonProps {
	variant?: "primary" | "secondary" | "danger";
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	loading?: boolean;
	children: React.ReactNode;
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
}

export interface InputProps {
	label?: string;
	error?: string;
	helperText?: string;
	required?: boolean;
	disabled?: boolean;
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
}

export interface ToastProps {
	message: string;
	type: "success" | "error" | "warning" | "info";
	duration?: number;
	onClose?: () => void;
}

export type ThemeMode = "light" | "dark" | "system";
