import { type InputProps } from "../../types/ui";
import { cn } from "../../lib/utils";

interface TextareaProps extends InputProps {
	rows?: number;
}

export function Textarea({
	label,
	error,
	helperText,
	required = false,
	disabled = false,
	placeholder,
	value,
	onChange,
	rows = 4,
}: TextareaProps) {
	const id = label ? label.toLowerCase().replace(/\s+/g, "-") : undefined;

	return (
		<div className="space-y-1">
			{label && (
				<label htmlFor={id} className="block text-sm font-medium text-gray-700">
					{label}
					{required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}

			<textarea
				id={id}
				rows={rows}
				disabled={disabled}
				required={required}
				placeholder={placeholder}
				value={value || ""}
				onChange={(e) => onChange?.(e.target.value)}
				className={cn(
					"block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-vertical",
					error && "border-red-500 focus:ring-red-500 focus:border-red-500",
					disabled && "bg-gray-50 cursor-not-allowed",
				)}
			/>

			{error && <p className="text-sm text-red-600">{error}</p>}

			{helperText && !error && (
				<p className="text-sm text-gray-500">{helperText}</p>
			)}
		</div>
	);
}
