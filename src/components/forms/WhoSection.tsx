import { useState } from "react";
import { RadioGroup } from "../ui/RadioGroup";
import { Input } from "../ui/Input";
import { type WhoType } from "../../types/reminder";

interface WhoSectionProps {
	value?: WhoType;
	onChange?: (value: WhoType) => void;
	error?: string;
}

export function WhoSection({ value, onChange, error }: WhoSectionProps) {
	const [whoType, setWhoType] = useState<string>(() => {
		if (value === "me") return "me";
		if (typeof value === "object") {
			return value.type;
		}
		return "me";
	});

	const [username, setUsername] = useState<string>(() => {
		if (typeof value === "object" && value.type === "user") {
			return value.username;
		}
		return "";
	});

	const [channelName, setChannelName] = useState<string>(() => {
		if (typeof value === "object" && value.type === "channel") {
			return value.channelName;
		}
		return "";
	});

	const handleWhoTypeChange = (newType: string) => {
		setWhoType(newType);

		if (newType === "me") {
			onChange?.("me");
		} else if (newType === "user") {
			onChange?.({ type: "user", username });
		} else if (newType === "channel") {
			onChange?.({ type: "channel", channelName });
		}
	};

	const handleUsernameChange = (newUsername: string) => {
		setUsername(newUsername);
		if (whoType === "user") {
			onChange?.({ type: "user", username: newUsername });
		}
	};

	const handleChannelNameChange = (newChannelName: string) => {
		setChannelName(newChannelName);
		if (whoType === "channel") {
			onChange?.({ type: "channel", channelName: newChannelName });
		}
	};

	const radioOptions = [
		{ value: "me", label: "自分 (me)" },
		{ value: "user", label: "特定ユーザー (@username)" },
		{ value: "channel", label: "チャンネル (#channel)" },
	];

	return (
		<div className="space-y-4">
			<RadioGroup
				label="通知先"
				name="who"
				options={radioOptions}
				value={whoType}
				onChange={handleWhoTypeChange}
				error={error}
				required
			/>

			{whoType === "user" && (
				<div className="ml-6">
					<Input
						label="ユーザー名"
						placeholder="username (@ は不要)"
						value={username}
						onChange={handleUsernameChange}
						helperText="例: john.doe"
					/>
				</div>
			)}

			{whoType === "channel" && (
				<div className="ml-6 space-y-2">
					<Input
						label="チャンネル名"
						placeholder="channel-name (# は不要)"
						value={channelName}
						onChange={handleChannelNameChange}
						helperText="例: general"
					/>
					<div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
						<div className="flex">
							<svg
								className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
									clipRule="evenodd"
								/>
							</svg>
							<div className="text-sm text-yellow-800">
								<p className="font-medium">注意</p>
								<p>
									チャンネルを選択した場合、リマインダーを設定した瞬間に「リマインダーを設定しました」という確認メッセージがそのチャンネルに公開で投稿されます。
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
