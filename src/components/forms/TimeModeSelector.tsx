import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { type TimeInputMode } from "../../types/reminder";

interface TimeModeSelectorProps {
	mode: TimeInputMode;
	onChange: (mode: TimeInputMode) => void;
}

export function TimeModeSelector({ mode, onChange }: TimeModeSelectorProps) {
	return (
		<Tabs
			value={mode}
			onValueChange={(value) => onChange(value as TimeInputMode)}
		>
			<TabsList className="grid w-full grid-cols-5">
				<TabsTrigger value="quick" className="flex items-center gap-2">
					<img src="/zap.svg" alt="zap" className="w-4 h-4" />
					<span className="hidden sm:inline">クイック</span>
				</TabsTrigger>
				<TabsTrigger value="calendar" className="flex items-center gap-2">
					<img src="/calendar-today.svg" alt="calendar" className="w-4 h-4" />
					<span className="hidden sm:inline">日付</span>
				</TabsTrigger>
				<TabsTrigger value="recurring" className="flex items-center gap-2">
					<img src="/reload.svg" alt="reload" className="w-4 h-4" />
					<span className="hidden sm:inline">繰り返し</span>
				</TabsTrigger>
				<TabsTrigger value="lastBusinessDay" className="flex items-center gap-2">
					<img src="/briefcase.svg" alt="briefcase" className="w-4 h-4" />
					<span className="hidden sm:inline">最終営業日</span>
				</TabsTrigger>
				<TabsTrigger value="custom" className="flex items-center gap-2">
					<img src="/edit.svg" alt="edit" className="w-4 h-4" />
					<span className="hidden sm:inline">カスタム</span>
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}
