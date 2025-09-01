import { timeConversionRules } from "../constants/timePatterns";
import { type TimeInput } from "../types/reminder";

export function convertJapaneseToEnglishTime(japaneseInput: string): TimeInput {
	const normalizedInput = japaneseInput.trim();

	if (!normalizedInput) {
		return {
			type: "natural",
			value: "",
			originalInput: japaneseInput,
		};
	}

	// 複数のルールを適用して最適なマッチを見つける
	for (const rule of timeConversionRules) {
		const match = normalizedInput.match(rule.pattern);
		if (match) {
			const convertedValue = rule.convert(match);
			return {
				type: rule.category,
				value: convertedValue,
				originalInput: japaneseInput,
			};
		}
	}

	// マッチしない場合は元の入力をそのまま返す（英語入力の可能性）
	return {
		type: "natural",
		value: normalizedInput,
		originalInput: japaneseInput,
	};
}

export function combineDateTime(timeInput: string, dateInput?: string): string {
	if (!dateInput) {
		return timeInput;
	}

	// 日付と時刻を組み合わせる場合の処理
	const dateTime = convertJapaneseToEnglishTime(dateInput);
	const time = convertJapaneseToEnglishTime(timeInput);

	if (dateTime.value && time.value) {
		return `${time.value} ${dateTime.value}`;
	}

	return timeInput;
}

export function validateTimeInput(timeInput: TimeInput): {
	isValid: boolean;
	warnings: string[];
} {
	const warnings: string[] = [];

	if (!timeInput.value) {
		return { isValid: false, warnings: ["時刻を入力してください"] };
	}

	// 過去の時刻チェック（簡単な実装）
	if (timeInput.type === "absolute" && timeInput.value.includes("at")) {
		warnings.push("指定した時刻が過去の場合、Slackは翌日として解釈します");
	}

	return { isValid: true, warnings };
}
