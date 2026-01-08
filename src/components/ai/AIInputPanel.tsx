import { useState, useEffect } from "react";
import { AISetupPrompt } from "./AISetupPrompt";
import { AISettingsDialog } from "./AISettingsDialog";
import { AITextInput } from "./AITextInput";
import { AIResultList } from "./AIResultList";
import { ShadcnButton } from "../ui/Button";
import { getAIApiKey, setAIApiKey } from "../../services/aiKeyStorage";
import { generateRemindCommands } from "../../utils/aiCommandGenerator";
import { useToast } from "../../hooks/useToast";
import type { AIResponse } from "../../types/ai";
import { Sparkles } from "lucide-react";

export function AIInputPanel() {
	const { showToast } = useToast();
	const [apiKey, setApiKeyState] = useState<string | null>(null);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [inputText, setInputText] = useState("");
	const [results, setResults] = useState<AIResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Load API key on mount
	useEffect(() => {
		const key = getAIApiKey();
		setApiKeyState(key);
	}, []);

	const handleSaveApiKey = (newApiKey: string) => {
		setAIApiKey(newApiKey);
		setApiKeyState(newApiKey);
		setIsSettingsOpen(false);
	};

	const handleGenerate = async () => {
		if (!apiKey) {
			setError("APIキーが設定されていません");
			setIsSettingsOpen(true);
			return;
		}

		if (!inputText.trim()) {
			setError("入力内容を記入してください");
			return;
		}

		setIsLoading(true);
		setError(null);
		setResults(null);

		try {
			const response = await generateRemindCommands({
				naturalLanguageInput: inputText,
				apiKey,
			});
			setResults(response);
			setError(null);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "予期しないエラーが発生しました";
			setError(errorMessage);
			setResults(null);
			showToast(errorMessage, "error");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCopy = async (commandText: string) => {
		try {
			await navigator.clipboard.writeText(commandText);
			showToast("コマンドをクリップボードにコピーしました", "success");
		} catch (err) {
			console.error("Failed to copy:", err);
			showToast("コピーに失敗しました", "error");
		}
	};

	return (
		<div className="space-y-6" data-testid="ai-input-panel">
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
						<Sparkles className="h-5 w-5 text-sky-600" />
						AI リマインダー生成
					</h2>
					{apiKey && (
						<ShadcnButton
							variant="ghost"
							size="sm"
							onClick={() => setIsSettingsOpen(true)}
						>
							設定
						</ShadcnButton>
					)}
				</div>

				{!apiKey && (
					<AISetupPrompt onOpenSettings={() => setIsSettingsOpen(true)} />
				)}

				{apiKey && (
					<>
						<AITextInput
							value={inputText}
							onChange={setInputText}
							placeholder="例: 明日の10時にミーティングをリマインド、毎週金曜日の15時にレビュー"
							helperText="自然な日本語でリマインダーの内容を入力してください"
							label="リマインダー内容"
							maxLength={500}
							disabled={isLoading}
						/>
						<div className="flex justify-end">
							<ShadcnButton
								onClick={handleGenerate}
								disabled={isLoading || !inputText.trim()}
							>
								{isLoading ? "生成中..." : "生成"}
							</ShadcnButton>
						</div>
					</>
				)}
			</div>

			{apiKey && (
				<AIResultList
					results={results}
					onCopy={handleCopy}
					isLoading={isLoading}
					error={error || undefined}
				/>
			)}

			<AISettingsDialog
				open={isSettingsOpen}
				onOpenChange={setIsSettingsOpen}
				onSave={handleSaveApiKey}
				initialApiKey={apiKey || ""}
			/>
		</div>
	);
}
