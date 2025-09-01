import { useState, useEffect } from "react";
import { Input } from "../ui/Input";
import {
	convertJapaneseToEnglishTime,
	validateTimeInput,
} from "../../utils/timeConverter";

interface WhenSectionProps {
	value?: string;
	onChange?: (value: string) => void;
	error?: string;
}

export function WhenSection({ value, onChange, error }: WhenSectionProps) {
	const [japaneseInput, setJapaneseInput] = useState("");
	const [convertedTime, setConvertedTime] = useState("");
	const [warnings, setWarnings] = useState<string[]>([]);

	useEffect(() => {
		if (japaneseInput) {
			const timeInput = convertJapaneseToEnglishTime(japaneseInput);
			const validation = validateTimeInput(timeInput);

			setConvertedTime(timeInput.value);
			setWarnings(validation.warnings);
			onChange?.(timeInput.value);
		} else {
			setConvertedTime("");
			setWarnings([]);
			onChange?.("");
		}
	}, [japaneseInput, onChange]);

	const examples = [
		{ japanese: "10分後", english: "in 10 minutes" },
		{ japanese: "明日17:00", english: "at 17:00 tomorrow" },
		{ japanese: "毎日午前9時", english: "at 9am every day" },
		{ japanese: "平日18:30", english: "at 18:30 every weekday" },
		{ japanese: "来週月曜日", english: "Monday" },
	];

	return (
		<div className="space-y-4">
			<Input
				label="日時指定"
				placeholder="例: 10分後、明日17:00、毎日午前9時"
				value={japaneseInput}
				onChange={setJapaneseInput}
				error={error}
				required
				helperText="日本語で入力すると自動的に英語形式に変換されます"
			/>

			{convertedTime && (
				<div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
					<h4 className="text-sm font-medium text-blue-800 mb-1">変換結果</h4>
					<code className="text-sm text-blue-900 bg-blue-100 px-2 py-1 rounded">
						{convertedTime}
					</code>
				</div>
			)}

			{warnings.length > 0 && (
				<div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
					<div className="flex">
						<svg
							className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
						<div className="text-sm text-yellow-800">
							{warnings.map((warning, index) => (
								<p key={index}>{warning}</p>
							))}
						</div>
					</div>
				</div>
			)}

			<details className="mt-4">
				<summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
					入力例を見る
				</summary>
				<div className="mt-3 space-y-2">
					{examples.map((example, index) => (
						<div
							key={index}
							className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
							onClick={() => setJapaneseInput(example.japanese)}
						>
							<div className="text-sm">
								<span className="text-gray-600">{example.japanese}</span>
								<span className="mx-2 text-gray-400">→</span>
								<code className="text-blue-600">{example.english}</code>
							</div>
						</div>
					))}
					<p className="text-xs text-gray-500 mt-2">
						例をクリックすると入力欄に設定されます
					</p>
				</div>
			</details>
		</div>
	);
}
