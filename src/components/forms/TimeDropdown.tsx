import { TimeInput } from "./TimeInput";

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
	return (
		<TimeInput
			value={value}
			onChange={onChange}
			label={label}
			placeholder={placeholder}
		/>
	);
}
