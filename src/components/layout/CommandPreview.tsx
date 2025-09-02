import { useState } from "react";
import { Button } from "../ui/Button";
import { generateCommand } from "../../utils/commandGenerator";
import { type ReminderConfig } from "../../types/reminder";

interface CommandPreviewProps {
	config: Partial<ReminderConfig>;
}

export function CommandPreview({ config }: CommandPreviewProps) {
	const [copySuccess, setCopySuccess] = useState(false);

	const command = generateCommand(config);
	const isCommandReady = command && command !== "/remind   ";

	const handleCopy = async () => {
		if (!command || !isCommandReady) return;

		try {
			await navigator.clipboard.writeText(command);
			setCopySuccess(true);
			setTimeout(() => setCopySuccess(false), 2000);
		} catch (err) {
			console.error("Failed to copy command:", err);
		}
	};

	if (!isCommandReady) {
		return (
			<div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
				<h3 className="text-lg font-medium text-slate-700 mb-2">
					コマンドプレビュー
				</h3>
				<p className="text-slate-500">
					すべての項目を入力するとコマンドが生成されます
				</p>
			</div>
		);
	}

	return (
		<div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
			<h3 className="text-lg font-medium text-slate-800 mb-4">
				生成されたコマンド
			</h3>

			<div className="mb-4">
				<div className="p-4 bg-slate-800 text-emerald-300 font-mono text-sm rounded-lg overflow-x-auto">
					<span className="text-sky-300">/remind</span>{" "}
					<span className="text-amber-300">
						{config.who === "me"
							? "me"
							: typeof config.who === "object" && config.who.type === "user"
								? `@${config.who.username}`
								: typeof config.who === "object" &&
										config.who.type === "channel"
									? `#${config.who.channelName}`
									: ""}
					</span>{" "}
					<span className="text-emerald-300">"{config.what}"</span>{" "}
					<span className="text-violet-300">{config.when}</span>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<Button
					onClick={handleCopy}
					variant={copySuccess ? "secondary" : "primary"}
					disabled={!isCommandReady}
				>
					{copySuccess ? (
						<>
							<img
								src="/check.svg"
								alt="calendar"
								className="w-4 h-4 mr-2 text-white"
							/>
							コピーしました！
						</>
					) : (
						<>
							<img
								src="/copy.svg"
								alt="calendar"
								className="w-4 h-4 mr-2 text-white"
							/>
							コマンドをコピー
						</>
					)}
				</Button>

				<div className="text-xs text-slate-500">
					Slackでこのコマンドを貼り付けて実行してください
				</div>
			</div>

			<div className="mt-4 p-3 bg-sky-50 border border-sky-200 rounded-md">
				<h4 className="text-sm font-medium text-sky-700 mb-2">使用方法</h4>
				<ol className="text-sm text-sky-600 space-y-1">
					<li>1. 上記のコマンドをコピー</li>
					<li>2. Slackのメッセージ入力欄に貼り付け</li>
					<li>3. Enterキーを押して実行</li>
				</ol>
			</div>
		</div>
	);
}
