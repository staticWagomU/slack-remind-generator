import { type ReminderConfig, type WhoType } from "../types/reminder";

export function formatWhoParameter(who: WhoType): string {
	if (who === "me") {
		return "me";
	}

	if (typeof who === "object") {
		if (who.type === "user") {
			return `@${who.username}`;
		}
		if (who.type === "channel") {
			return `#${who.channelName}`;
		}
	}

	return "me";
}

export function escapeMessage(message: string): string {
	// 基本的なエスケープ処理
	if (!message) return '""';

	// 引用符を含む場合は引用符で囲む
	if (
		message.includes(" ") ||
		message.includes("\n") ||
		message.includes('"')
	) {
		return `"${message.replace(/"/g, '\\"')}"`;
	}

	return message;
}

export function generateCommand(config: Partial<ReminderConfig>): string {
	if (!config.who || !config.what || !config.when) {
		return "";
	}

	const who = formatWhoParameter(config.who);
	const what = escapeMessage(config.what);
	const when = config.when;

	return `/remind ${who} ${what} ${when}`;
}

export function parseGeneratedCommand(
	command: string,
): { who: string; what: string; when: string } | null {
	const match = command.match(
		/^\/remind\s+(\S+)\s+(.+?)\s+((?:at|in|on|every|tomorrow|today|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday).*)$/,
	);

	if (!match) {
		return null;
	}

	return {
		who: match[1],
		what: match[2].replace(/^"|"$/g, ""), // 引用符を除去
		when: match[3],
	};
}
