import { useState, useEffect, useRef } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { ShadcnButton } from "../ui/Button";

export interface AISettingsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (apiKey: string) => void;
	initialApiKey?: string;
}

export function AISettingsDialog({
	open,
	onOpenChange,
	onSave,
	initialApiKey = "",
}: AISettingsDialogProps) {
	const [apiKey, setApiKey] = useState(initialApiKey);
	const [error, setError] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	// Reset state when dialog opens
	useEffect(() => {
		if (open) {
			setApiKey(initialApiKey);
			setError("");
			// Focus input when dialog opens
			setTimeout(() => {
				inputRef.current?.focus();
			}, 0);
		}
	}, [open, initialApiKey]);

	const handleSave = () => {
		const trimmedKey = apiKey.trim();
		if (!trimmedKey) {
			setError("APIキーを入力してください");
			inputRef.current?.focus();
			return;
		}
		setError("");
		onSave(trimmedKey);
	};

	const handleCancel = () => {
		setError("");
		onOpenChange(false);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setApiKey(e.target.value);
		if (error && e.target.value.trim()) {
			setError("");
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSave();
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent data-testid="ai-settings-dialog">
				<DialogHeader>
					<DialogTitle>AI設定</DialogTitle>
					<DialogDescription>
						OpenAI APIキーを入力してください
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<label
							htmlFor="api-key"
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							APIキー
						</label>
						<input
							ref={inputRef}
							id="api-key"
							type="password"
							value={apiKey}
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
							className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
							placeholder="sk-..."
							aria-invalid={!!error}
							aria-describedby={error ? "api-key-error" : undefined}
						/>
						{error && (
							<p id="api-key-error" className="text-sm text-red-600" role="alert">
								{error}
							</p>
						)}
					</div>
				</div>
				<DialogFooter>
					<ShadcnButton
						variant="outline"
						onClick={handleCancel}
					>
						キャンセル
					</ShadcnButton>
					<ShadcnButton onClick={handleSave}>
						保存
					</ShadcnButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
