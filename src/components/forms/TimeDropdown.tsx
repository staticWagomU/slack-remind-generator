import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { generateTimeOptions } from "../../utils/timeFormatter";

interface TimeDropdownProps {
	value: string;
	onChange: (value: string) => void;
	label?: string;
	placeholder?: string;
}

export function TimeDropdown({
	value,
	onChange,
	label = "時刻",
	placeholder = "時刻を選択",
}: TimeDropdownProps) {
	const timeOptions = generateTimeOptions();

	return (
		<div className="space-y-2">
			{label && (
				<label className="text-sm font-medium text-gray-700">{label}</label>
			)}
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{timeOptions.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
