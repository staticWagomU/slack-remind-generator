import { useState } from "react";
import { WhoSection } from "../forms/WhoSection";
import { WhatSection } from "../forms/WhatSection";
import { WhenSection } from "../forms/WhenSection";
import { CommandPreview } from "./CommandPreview";
import { AIInputPanel } from "../ai/AIInputPanel";
import {
	type ReminderConfig,
	type WhoType,
	type ValidationError,
} from "../../types/reminder";

export function MainForm() {
	const [reminderConfig, setReminderConfig] = useState<Partial<ReminderConfig>>(
		{
			who: "me",
			what: "",
			when: "",
		},
	);

	const [errors, setErrors] = useState<ValidationError[]>([]);

	const validateConfig = (
		config: Partial<ReminderConfig>,
	): ValidationError[] => {
		const newErrors: ValidationError[] = [];

		// whoの検証
		if (!config.who) {
			newErrors.push({
				field: "who",
				message: "通知先を選択してください",
				severity: "error",
			});
		} else if (typeof config.who === "object") {
			if (config.who.type === "user" && !config.who.username) {
				newErrors.push({
					field: "who",
					message: "ユーザー名を入力してください",
					severity: "error",
				});
			}
			if (config.who.type === "channel" && !config.who.channelName) {
				newErrors.push({
					field: "who",
					message: "チャンネル名を入力してください",
					severity: "error",
				});
			}
		}

		// whatの検証
		if (!config.what?.trim()) {
			newErrors.push({
				field: "what",
				message: "メッセージを入力してください",
				severity: "error",
			});
		} else if (config.what.length > 500) {
			newErrors.push({
				field: "what",
				message: "メッセージは500文字以内で入力してください",
				severity: "error",
			});
		}

		// whenの検証
		if (!config.when?.trim()) {
			newErrors.push({
				field: "when",
				message: "日時を入力してください",
				severity: "error",
			});
		}

		// Slack仕様による警告
		if (
			config.who &&
			typeof config.who === "object" &&
			config.who.type === "user" &&
			config.when &&
			config.when.includes("every")
		) {
			newErrors.push({
				field: "when",
				message: "他ユーザーに繰り返しリマインダーは設定できません",
				severity: "error",
			});
		}

		return newErrors;
	};

	const updateConfig = <K extends keyof ReminderConfig>(
		field: K,
		value: ReminderConfig[K],
	) => {
		const newConfig = { ...reminderConfig, [field]: value };
		setReminderConfig(newConfig);

		// リアルタイムバリデーション
		const newErrors = validateConfig(newConfig);
		setErrors(newErrors);
	};

	const getFieldError = (field: keyof ReminderConfig): string | undefined => {
		const error = errors.find(
			(e) => e.field === field && e.severity === "error",
		);
		return error?.message;
	};

	return (
		<div className="max-w-6xl mx-auto p-6">
			<div className="mb-8 text-center">
				<h1 className="text-3xl font-bold text-slate-800 mb-2">
					Slackリマインドコマンド生成
				</h1>
				<p className="text-slate-600">
					日本語で入力して、Slackの/remindコマンドを簡単生成
				</p>
			</div>

			{/* AI入力セクション */}
			<div className="mb-8 p-6 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-lg">
				<AIInputPanel />
			</div>

			{/* 視覚的な区切り線 */}
			<div className="mb-8 flex items-center gap-4">
				<div className="flex-1 h-px bg-slate-200" />
				<span className="text-sm text-slate-500 font-medium">
					または手動で入力
				</span>
				<div className="flex-1 h-px bg-slate-200" />
			</div>

			{/* 手動入力セクション */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="space-y-8">
					<div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
						<WhoSection
							value={reminderConfig.who}
							onChange={(value: WhoType) => updateConfig("who", value)}
							error={getFieldError("who")}
						/>
					</div>

					<div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
						<WhatSection
							value={reminderConfig.what}
							onChange={(value: string) => updateConfig("what", value)}
							error={getFieldError("what")}
						/>
					</div>

					<div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
						<WhenSection
							value={reminderConfig.when}
							onChange={(value: string) => updateConfig("when", value)}
							error={getFieldError("when")}
						/>
					</div>
				</div>

				<div className="lg:sticky lg:top-6 lg:h-fit">
					<CommandPreview config={reminderConfig} />

					{errors.filter((e) => e.severity === "warning").length > 0 && (
						<div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
							<h4 className="text-sm font-medium text-amber-700 mb-2">
								注意事項
							</h4>
							<ul className="text-sm text-amber-600 space-y-1">
								{errors
									.filter((e) => e.severity === "warning")
									.map((error, index) => (
										<li key={index}>• {error.message}</li>
									))}
							</ul>
						</div>
					)}
				</div>
			</div>

			<div className="mt-12 p-6 bg-slate-50 border border-slate-200 rounded-lg">
				<h3 className="text-lg font-medium text-slate-800 mb-3">
					Slackリマインダーについて
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
					<div>
						<h4 className="font-medium text-slate-700 mb-2">基本的な使い方</h4>
						<ul className="space-y-1">
							<li>• 生成されたコマンドをSlackで実行</li>
							<li>• 日時は英語形式で指定する必要があります</li>
							<li>• このアプリが日本語を自動変換します</li>
						</ul>
					</div>
					<div>
						<h4 className="font-medium text-slate-700 mb-2">制限事項</h4>
						<ul className="space-y-1">
							<li>• 設定後のリマインダーは編集できません</li>
							<li>• 他ユーザーへの繰り返し設定は不可</li>
							<li>• チャンネル設定時は公開メッセージが投稿されます</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
