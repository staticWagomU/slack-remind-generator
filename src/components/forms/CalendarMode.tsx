import { useState, useEffect } from "react";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ShadcnButton } from "../ui/Button";
import { TimeDropdown } from "./TimeDropdown";
import { formatCalendarSelection } from "../../utils/timeFormatter";

interface CalendarModeProps {
	onChange: (value: string) => void;
}

export function CalendarMode({ onChange }: CalendarModeProps) {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(),
	);
	const [selectedTime, setSelectedTime] = useState<string>("09:00");

	// 日付または時刻が変更されたら英語形式に変換
	useEffect(() => {
		if (selectedDate && selectedTime) {
			const formatted = formatCalendarSelection(selectedDate, selectedTime);
			onChange(formatted);
		} else {
			onChange("");
		}
	}, [selectedDate, selectedTime]); // onChangeを依存配列から除外

	// 過去の日付を無効化
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	// 最大3ヶ月先まで選択可能
	const maxDate = new Date();
	maxDate.setMonth(maxDate.getMonth() + 3);

	const formatSelectedDate = (date: Date | undefined) => {
		if (!date) return "日付を選択";
		return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<label className="text-sm font-medium text-gray-700">日付選択</label>
				<Popover>
					<PopoverTrigger asChild>
						<ShadcnButton
							variant="outline"
							className="w-full justify-start text-left font-normal"
						>
							📅 {formatSelectedDate(selectedDate)}
						</ShadcnButton>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={setSelectedDate}
							disabled={(date) => date < today || date > maxDate}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			</div>

			<TimeDropdown
				value={selectedTime}
				onChange={setSelectedTime}
				label="時刻選択"
				placeholder="時刻を選択してください"
			/>

			{selectedDate && selectedTime && (
				<div className="p-3 bg-green-50 border border-green-200 rounded-md">
					<p className="text-sm text-green-800">
						<strong>選択中:</strong> {formatSelectedDate(selectedDate)}{" "}
						{selectedTime}
					</p>
				</div>
			)}

			<p className="text-xs text-gray-500">今日以降、3ヶ月先まで選択できます</p>
		</div>
	);
}
