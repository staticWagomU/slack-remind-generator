import type { AIResponse } from "../../types/ai";
import { AIResultCard } from "./AIResultCard";

export interface AIResultListProps {
	results: AIResponse | null;
	onCopy: (commandText: string) => void;
	isLoading?: boolean;
	error?: string;
}

export function AIResultList({
	results,
	onCopy,
	isLoading = false,
	error,
}: AIResultListProps) {
	if (isLoading) {
		return (
			<div
				data-testid="ai-result-list-loading"
				className="space-y-3"
				role="status"
				aria-label="読み込み中"
			>
				{[1, 2].map((i) => (
					<div
						key={i}
						className="animate-pulse rounded-lg border border-slate-200 bg-slate-50 p-4 h-24"
					/>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div
				data-testid="ai-result-list-error"
				className="rounded-lg border border-red-200 bg-red-50 p-4"
				role="alert"
			>
				<p className="text-sm text-red-800">{error}</p>
			</div>
		);
	}

	if (!results || results.commands.length === 0) {
		return (
			<div
				data-testid="ai-result-list-empty"
				className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center"
			>
				<p className="text-sm text-slate-600">
					リマインダーを生成するには、上の入力欄に自然な日本語で入力してください。
				</p>
			</div>
		);
	}

	return (
		<div data-testid="ai-result-list" className="space-y-3">
			{results.commands.map((command, index) => (
				<AIResultCard
					key={index}
					command={command}
					confidence={results.confidence}
					onCopy={onCopy}
				/>
			))}
		</div>
	);
}
