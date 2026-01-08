import { ShadcnButton } from "../ui/Button";
import { cn } from "../../lib/utils";

export interface AISetupPromptProps {
	onOpenSettings: () => void;
}

export function AISetupPrompt({ onOpenSettings }: AISetupPromptProps) {
	return (
		<div
			data-testid="ai-setup-prompt"
			role="alert"
			className={cn(
				"rounded-lg border border-slate-200 bg-slate-50 p-4",
				"flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
			)}
		>
			<div className="flex flex-col gap-1">
				<p className="text-sm font-medium text-slate-900">
					AI機能を使用するには
				</p>
				<p className="text-sm text-slate-600">OpenAI APIキーの設定が必要です</p>
			</div>
			<ShadcnButton onClick={onOpenSettings} variant="outline" size="sm">
				設定
			</ShadcnButton>
		</div>
	);
}
