import { cn } from "../../lib/utils";

interface RadioOption {
	value: string;
	label: string;
	disabled?: boolean;
}

interface RadioGroupProps {
	label?: string;
	name: string;
	options: RadioOption[];
	value?: string;
	onChange?: (value: string) => void;
	error?: string;
	required?: boolean;
}

export function RadioGroup({
	label,
	name,
	options,
	value,
	onChange,
	error,
	required = false,
}: RadioGroupProps) {
	return (
		<div className="space-y-3">
			{label && (
				<fieldset>
					<legend className="block text-sm font-medium text-slate-700">
						{label}
						{required && <span className="text-red-500 ml-1">*</span>}
					</legend>
				</fieldset>
			)}

			<div className="space-y-2">
				{options.map((option) => (
					<label
						key={option.value}
						className={cn(
							"flex items-center cursor-pointer",
							option.disabled && "cursor-not-allowed opacity-50",
						)}
					>
						<input
							type="radio"
							name={name}
							value={option.value}
							checked={value === option.value}
							disabled={option.disabled}
							onChange={(e) => onChange?.(e.target.value)}
							className="h-4 w-4 text-sky-600 border-slate-300 focus:ring-sky-500"
						/>
						<span className="ml-2 text-sm text-slate-700">{option.label}</span>
					</label>
				))}
			</div>

			{error && <p className="text-sm text-red-600">{error}</p>}
		</div>
	);
}
