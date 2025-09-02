import { useState } from "react";
import { TimeModeSelector } from "./TimeModeSelector";
import { QuickSelectMode } from "./QuickSelectMode";
import { CalendarMode } from "./CalendarMode";
import { RecurringMode } from "./RecurringMode";
import { CustomMode } from "./CustomMode";
import { type TimeInputMode } from "../../types/reminder";

interface WhenSectionProps {
	value?: string;
	onChange?: (value: string) => void;
	error?: string;
}

export function WhenSection({
	value: _value,
	onChange,
	error,
}: WhenSectionProps) {
	const [mode, setMode] = useState<TimeInputMode>("quick");
	const [convertedTime, setConvertedTime] = useState("");

	const handleModeChange = (newMode: TimeInputMode) => {
		setMode(newMode);
		// モード切り替え時に値をクリア
		setConvertedTime("");
		if (onChange) {
			onChange("");
		}
	};

	const handleTimeChange = (newValue: string) => {
		if (convertedTime !== newValue) {
			// 同じ値の場合は更新しない
			setConvertedTime(newValue);
			if (onChange) {
				onChange(newValue);
			}
		}
	};

	return (
		<div className="space-y-4">
			<div>
				<label className="text-sm font-medium text-gray-700 mb-3 block">
					日時指定
				</label>
				<TimeModeSelector mode={mode} onChange={handleModeChange} />
			</div>

			<div className="mt-4">
				{mode === "quick" && <QuickSelectMode onChange={handleTimeChange} />}

				{mode === "calendar" && <CalendarMode onChange={handleTimeChange} />}

				{mode === "recurring" && <RecurringMode onChange={handleTimeChange} />}

				{mode === "custom" && <CustomMode onChange={handleTimeChange} />}
			</div>

			{/* エラー表示 */}
			{error && (
				<div className="p-3 bg-red-50 border border-red-200 rounded-md">
					<p className="text-sm text-red-700">{error}</p>
				</div>
			)}

			{/* 変換結果の表示 */}
			{convertedTime && (
				<div className="p-3 bg-green-50 border border-green-200 rounded-md">
					<h4 className="text-sm font-medium text-green-800 mb-1">
						生成されるコマンド（when部分）
					</h4>
					<code className="text-sm text-green-900 bg-green-100 px-2 py-1 rounded font-mono">
						{convertedTime}
					</code>
				</div>
			)}
		</div>
	);
}
