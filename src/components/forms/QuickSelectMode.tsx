import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { quickOptions } from "../../utils/timeFormatter";

interface QuickSelectModeProps {
	onChange: (value: string) => void;
}

export function QuickSelectMode({ onChange }: QuickSelectModeProps) {
	const relativeOptions = quickOptions.filter(
		(option) => option.category === "relative",
	);
	const tomorrowOptions = quickOptions.filter(
		(option) => option.category === "tomorrow",
	);

	return (
		<div className="space-y-2">
			<label className="text-sm font-medium text-slate-700">
				よく使う時間設定
			</label>
			<Select onValueChange={onChange}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="時間設定を選択してください" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>相対時間（現在から）</SelectLabel>
						{relativeOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectGroup>
					<SelectGroup>
						<SelectLabel>明日の時間</SelectLabel>
						{tomorrowOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			<p className="text-xs text-slate-500">
				よく使用される時間設定から選択できます
			</p>
		</div>
	);
}
