import { useState, useEffect } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { TimeDropdown } from "./TimeDropdown";
import {
	getLastBusinessDay,
	generateYearOptions,
	generateMonthOptions,
} from "../../utils/businessDayCalculator";
import { formatCalendarSelection } from "../../utils/timeFormatter";
import { type LastBusinessDayConfig } from "../../types/reminder";

interface LastBusinessDayModeProps {
	onChange: (value: string) => void;
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export function LastBusinessDayMode({ onChange }: LastBusinessDayModeProps) {
	const currentDate = new Date();
	const [config, setConfig] = useState<LastBusinessDayConfig>({
		year: currentDate.getFullYear(),
		month: currentDate.getMonth() + 1,
		selectedTime: "09:00",
	});
	const [calculatedDate, setCalculatedDate] = useState<Date | null>(null);

	// 設定が変更されたら最終営業日を計算
	useEffect(() => {
		const lastBusinessDay = getLastBusinessDay(config.year, config.month);
		setCalculatedDate(lastBusinessDay);

		// formatCalendarSelection を再利用して英語形式に変換
		const formatted = formatCalendarSelection(
			lastBusinessDay,
			config.selectedTime,
		);
		onChange(formatted);
	}, [config.year, config.month, config.selectedTime]);

	const yearOptions = generateYearOptions();
	const monthOptions = generateMonthOptions();

	const handleYearChange = (value: string) => {
		setConfig((prev) => ({ ...prev, year: parseInt(value, 10) }));
	};

	const handleMonthChange = (value: string) => {
		setConfig((prev) => ({ ...prev, month: parseInt(value, 10) }));
	};

	const handleTimeChange = (selectedTime: string) => {
		setConfig((prev) => ({ ...prev, selectedTime }));
	};

	const formatDateDisplay = (date: Date): string => {
		return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日(${WEEKDAYS[date.getDay()]})`;
	};

	return (
		<div className="space-y-4">
			{/* 年月選択 */}
			<div className="space-y-2">
				<label className="text-sm font-medium text-slate-700">年月を選択</label>
				<div className="flex gap-2">
					<Select
						value={config.year.toString()}
						onValueChange={handleYearChange}
					>
						<SelectTrigger className="w-32">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{yearOptions.map((opt) => (
								<SelectItem key={opt.value} value={opt.value.toString()}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={config.month.toString()}
						onValueChange={handleMonthChange}
					>
						<SelectTrigger className="w-24">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{monthOptions.map((opt) => (
								<SelectItem key={opt.value} value={opt.value.toString()}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* 時刻選択 */}
			<TimeDropdown
				value={config.selectedTime}
				onChange={handleTimeChange}
				label="時刻"
				placeholder="時刻を選択してください"
			/>

			{/* 計算結果プレビュー */}
			{calculatedDate && (
				<div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
					<p className="text-sm text-amber-700">
						<strong>最終営業日:</strong> {formatDateDisplay(calculatedDate)}{" "}
						{config.selectedTime}
					</p>
				</div>
			)}

			<p className="text-xs text-slate-500">
				土日祝（日本の祝日）を除いた月の最後の日にリマインドします
			</p>
		</div>
	);
}
