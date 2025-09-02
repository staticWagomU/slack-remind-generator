import { useState, useEffect } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/Input";
import { TimeDropdown } from "./TimeDropdown";
import {
	formatRecurringPattern,
	weekdayOptions,
} from "../../utils/timeFormatter";
import { type RecurringConfig } from "../../types/reminder";

interface RecurringModeProps {
	onChange: (value: string) => void;
}

export function RecurringMode({ onChange }: RecurringModeProps) {
	const [config, setConfig] = useState<RecurringConfig>({
		frequency: "daily",
		selectedDays: [],
		selectedTime: "09:00",
		isEveryOther: false,
		dayOfMonth: undefined,
	});

	// 設定が変更されたら英語形式に変換
	useEffect(() => {
		const formatted = formatRecurringPattern(config);
		onChange(formatted);
	}, [
		config.frequency,
		config.selectedDays.join(","), // 配列を文字列に変換して監視
		config.selectedTime,
		config.isEveryOther,
		config.dayOfMonth,
	]);

	const handleFrequencyChange = (frequency: RecurringConfig["frequency"]) => {
		setConfig((prev) => ({
			...prev,
			frequency,
			selectedDays:
				frequency === "daily" ||
				frequency === "weekday" ||
				frequency === "monthly"
					? []
					: prev.selectedDays,
			isEveryOther: frequency === "biweekly" ? true : prev.isEveryOther,
		}));
	};

	const handleDayToggle = (day: string, checked: boolean) => {
		setConfig((prev) => ({
			...prev,
			selectedDays: checked
				? [...prev.selectedDays, day]
				: prev.selectedDays.filter((d) => d !== day),
		}));
	};

	const handleTimeChange = (selectedTime: string) => {
		setConfig((prev) => ({ ...prev, selectedTime }));
	};

	const handleEveryOtherToggle = (checked: boolean) => {
		setConfig((prev) => ({ ...prev, isEveryOther: checked }));
	};

	const handleDayOfMonthChange = (value: string) => {
		const dayOfMonth = parseInt(value, 10);
		setConfig((prev) => ({
			...prev,
			dayOfMonth: isNaN(dayOfMonth)
				? undefined
				: Math.min(Math.max(dayOfMonth, 1), 31),
		}));
	};

	const showDaySelection =
		config.frequency === "weekly" || config.frequency === "biweekly";
	const showEveryOtherOption =
		config.frequency === "weekly" && config.selectedDays.length > 0;
	const showDayOfMonth = config.frequency === "monthly";

	return (
		<div className="space-y-4">
			{/* 頻度選択 */}
			<div className="space-y-2">
				<label className="text-sm font-medium text-slate-700">
					繰り返しパターン
				</label>
				<Select value={config.frequency} onValueChange={handleFrequencyChange}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="繰り返しパターンを選択" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="daily">毎日</SelectItem>
						<SelectItem value="weekday">平日のみ</SelectItem>
						<SelectItem value="weekly">毎週（曜日指定）</SelectItem>
						<SelectItem value="biweekly">隔週（曜日指定）</SelectItem>
						<SelectItem value="monthly">毎月（日付指定）</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* 時刻選択 */}
			<TimeDropdown
				value={config.selectedTime}
				onChange={handleTimeChange}
				label="時刻"
				placeholder="時刻を選択してください"
			/>

			{/* 曜日選択 */}
			{showDaySelection && (
				<div className="space-y-3">
					<label className="text-sm font-medium text-slate-700">
						曜日を選択
					</label>
					<div className="grid grid-cols-2 gap-2">
						{weekdayOptions.map((day) => (
							<div key={day.value} className="flex items-center space-x-2">
								<Checkbox
									id={day.value}
									checked={config.selectedDays.includes(day.value)}
									onCheckedChange={(checked) =>
										handleDayToggle(day.value, checked === true)
									}
								/>
								<label
									htmlFor={day.value}
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									{day.label}
								</label>
							</div>
						))}
					</div>
					{config.selectedDays.length === 0 && (
						<p className="text-xs text-red-500">
							少なくとも1つの曜日を選択してください
						</p>
					)}
				</div>
			)}

			{/* 隔週オプション（毎週選択時のみ表示） */}
			{showEveryOtherOption && (
				<div className="flex items-center space-x-2">
					<Checkbox
						id="everyOther"
						checked={config.isEveryOther}
						onCheckedChange={handleEveryOtherToggle}
					/>
					<label
						htmlFor="everyOther"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						隔週にする（every other）
					</label>
				</div>
			)}

			{/* 月の日付選択 */}
			{showDayOfMonth && (
				<div className="space-y-2">
					<label className="text-sm font-medium text-slate-700">
						毎月の日付
					</label>
					<Input
						type="number"
						min="1"
						max="31"
						placeholder="日付を入力（1-31）"
						value={config.dayOfMonth?.toString() || ""}
						onChange={handleDayOfMonthChange}
						className="w-24"
					/>
					<p className="text-xs text-slate-500">1〜31の間で指定してください</p>
				</div>
			)}

			{/* プレビュー */}
			<div className="p-3 bg-sky-50 border border-sky-200 rounded-md">
				<p className="text-sm text-sky-700">
					<strong>設定内容:</strong>{" "}
					{formatRecurringPattern(config) || "設定を完了してください"}
				</p>
			</div>
		</div>
	);
}
