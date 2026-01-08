import type { RemindCommand, ConfidenceScore } from "../../types/ai";
import { ShadcnButton } from "../ui/Button";
import { cn } from "../../lib/utils";
import { Copy, AlertTriangle } from "lucide-react";

export interface AIResultCardProps {
	command: RemindCommand;
	confidence: ConfidenceScore;
	onCopy: (commandText: string) => void;
}

function formatRemindCommand(command: RemindCommand): string {
	return `remind ${command.who} "${command.what}" ${command.when}`;
}

function getConfidenceBadgeClass(confidence: ConfidenceScore): string {
	if (confidence >= 0.8) {
		return "bg-green-100 text-green-800";
	}
	if (confidence >= 0.6) {
		return "bg-yellow-100 text-yellow-800";
	}
	return "bg-red-100 text-red-800";
}

export function AIResultCard({
	command,
	confidence,
	onCopy,
}: AIResultCardProps) {
	const commandText = formatRemindCommand(command);
	const isLowConfidence = confidence < 0.7;
	const confidencePercent = Math.round(confidence * 100);

	const handleCopy = () => {
		onCopy(commandText);
	};

	return (
		<div
			data-testid="ai-result-card"
			className={cn(
				"rounded-lg border border-slate-200 bg-white p-4",
				"flex flex-col gap-3",
			)}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="flex-1">
					<code className="block rounded bg-slate-50 p-3 text-sm font-mono text-slate-900">
						{commandText}
					</code>
				</div>
				<div className="flex items-center gap-2">
					<span
						className={cn(
							"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
							getConfidenceBadgeClass(confidence),
						)}
					>
						{confidencePercent}%
					</span>
					<ShadcnButton variant="outline" size="sm" onClick={handleCopy}>
						<Copy className="h-4 w-4 mr-1" />
						コピー
					</ShadcnButton>
				</div>
			</div>
			{isLowConfidence && (
				<div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
					<AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
					<p>信頼度が低いため、コマンドを確認してください。</p>
				</div>
			)}
		</div>
	);
}
