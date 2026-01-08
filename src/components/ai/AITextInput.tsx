import { cn } from "../../lib/utils";

export interface AITextInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	helperText?: string;
	label?: string;
	maxLength?: number;
	disabled?: boolean;
}

export function AITextInput({
	value,
	onChange,
	placeholder,
	helperText,
	label,
	maxLength = 500,
	disabled = false,
}: AITextInputProps) {
	const charCount = value.length;
	const isNearLimit = maxLength && charCount >= maxLength * 0.9;
	const isAtLimit = maxLength && charCount >= maxLength;

	const counterColorClass = isAtLimit
		? "text-red-600"
		: isNearLimit
			? "text-amber-600"
			: "text-slate-500";

	return (
		<div className="space-y-2" data-testid="ai-text-input">
			{label && (
				<label
					htmlFor="ai-text-input-field"
					className="block text-sm font-medium text-slate-900"
				>
					{label}
				</label>
			)}
			<textarea
				id="ai-text-input-field"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				disabled={disabled}
				maxLength={maxLength}
				rows={4}
				className={cn(
					"block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm placeholder:text-slate-400",
					"focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500",
					"disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
					"resize-y",
				)}
			/>
			<div className="flex items-center justify-between">
				<div>
					{helperText && (
						<p className="text-sm text-slate-500">{helperText}</p>
					)}
				</div>
				{maxLength && (
					<p className={cn("text-sm", counterColorClass)}>
						{charCount} / {maxLength}
					</p>
				)}
			</div>
		</div>
	);
}
