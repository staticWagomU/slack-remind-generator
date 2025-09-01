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
			<div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
				<h3 className="text-lg font-medium text-gray-700 mb-2">
					コマンドプレビュー
				</h3>
				<p className="text-gray-500">
					すべての項目を入力するとコマンドが生成されます
				</p>
			</div>
		);
	}

	return (
		<div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
			<h3 className="text-lg font-medium text-gray-900 mb-4">
				生成されたコマンド
			</h3>

			<div className="mb-4">
				<div className="p-4 bg-gray-900 text-green-400 font-mono text-sm rounded-lg overflow-x-auto">
					<span className="text-blue-400">/remind</span>{" "}
					<span className="text-yellow-400">
						{config.who === "me"
							? "me"
							: typeof config.who === "object" && config.who.type === "user"
								? `@${config.who.username}`
								: typeof config.who === "object" &&
										config.who.type === "channel"
									? `#${config.who.channelName}`
									: ""}
					</span>{" "}
					<span className="text-green-400">"{config.what}"</span>{" "}
					<span className="text-purple-400">{config.when}</span>
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
							<svg
								className="w-4 h-4 mr-2"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clipRule="evenodd"
								/>
							</svg>
							コピーしました！
						</>
					) : (
						<>
							<svg
								className="w-4 h-4 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
								/>
							</svg>
							コマンドをコピー
						</>
					)}
				</Button>

				<div className="text-xs text-gray-500">
					Slackでこのコマンドを貼り付けて実行してください
				</div>
			</div>

			<div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
				<h4 className="text-sm font-medium text-blue-800 mb-2">使用方法</h4>
				<ol className="text-sm text-blue-700 space-y-1">
					<li>1. 上記のコマンドをコピー</li>
					<li>2. Slackのメッセージ入力欄に貼り付け</li>
					<li>3. Enterキーを押して実行</li>
				</ol>
			</div>
		</div>
	);
}
