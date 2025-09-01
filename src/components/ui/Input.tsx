import { type InputProps } from "../../types/ui";
import { cn } from "../../lib/utils";

export function Input({
	label,
	error,
	helperText,
	required = false,
	disabled = false,
	placeholder,
	value,
	onChange,
}: InputProps & { type?: string; id?: string }) {
	const id = label ? label.toLowerCase().replace(/\s+/g, "-") : undefined;

	return (
		<div className="space-y-1">
			{label && (
				<label htmlFor={id} className="block text-sm font-medium text-gray-700">
					{label}
					{required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}

			<input
				id={id}
				type="text"
				disabled={disabled}
				required={required}
				placeholder={placeholder}
				value={value || ""}
				onChange={(e) => onChange?.(e.target.value)}
				className={cn(
					"block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
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
