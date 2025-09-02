import { type RecurringConfig, type QuickTimeOption } from "../types/reminder";

/**
 * 時刻を30分刻みで生成する
 */
export function generateTimeOptions(): Array<{ label: string; value: string }> {
	const options: Array<{ label: string; value: string }> = [];

	for (let hour = 0; hour < 24; hour++) {
		for (let minute = 0; minute < 60; minute += 30) {
			const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
			const displayTime = formatTimeDisplay(hour, minute);
			options.push({
				label: displayTime,
				value: timeString,
			});
		}
	}

	return options;
}

/**
 * 時刻の表示形式をフォーマット
 */
function formatTimeDisplay(hour: number, minute: number): string {
	const period = hour >= 12 ? "PM" : "AM";
	const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
	const minuteStr =
		minute === 0 ? "" : `:${minute.toString().padStart(2, "0")}`;
	return `${displayHour}${minuteStr} ${period}`;
}

/**
 * カレンダー選択結果を英語形式に変換
 */
export function formatCalendarSelection(date: Date, time: string): string {
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const year = date.getFullYear();
	return `at ${convertTo12HourFormat(time)} on ${month}/${day}/${year}`;
}

/**
 * 24時間形式を12時間形式に変換
 */
function convertTo12HourFormat(time24: string): string {
	const [hourStr, minuteStr] = time24.split(":");
	const hour = parseInt(hourStr, 10);
	const minute = parseInt(minuteStr, 10);

	if (hour === 0) {
		return minute === 0 ? "12am" : `12:${minuteStr}am`;
	} else if (hour < 12) {
		return minute === 0 ? `${hour}am` : `${hour}:${minuteStr}am`;
	} else if (hour === 12) {
		return minute === 0 ? "12pm" : `12:${minuteStr}pm`;
	} else {
		const displayHour = hour - 12;
		return minute === 0 ? `${displayHour}pm` : `${displayHour}:${minuteStr}pm`;
	}
}

/**
 * 繰り返しパターンを英語形式に変換
 */
export function formatRecurringPattern(config: RecurringConfig): string {
	const { frequency, selectedDays, selectedTime, isEveryOther, dayOfMonth } =
		config;
	const formattedTime = convertTo12HourFormat(selectedTime);

	switch (frequency) {
		case "daily":
			return `at ${formattedTime} every day`;

		case "weekday":
			return `at ${formattedTime} every weekday`;

		case "weekly":
			if (selectedDays.length === 0) return "";
			if (isEveryOther) {
				return `at ${formattedTime} every other ${selectedDays.join(" and ")}`;
			}
			return `at ${formattedTime} every ${selectedDays.join(" and ")}`;

		case "biweekly":
			if (selectedDays.length === 0) return "";
			return `at ${formattedTime} every other ${selectedDays.join(" and ")}`;

		case "monthly":
			if (dayOfMonth) {
				const dayWithSuffix = getDayWithOrdinalSuffix(dayOfMonth);
				return `at ${formattedTime} on the ${dayWithSuffix} of every month`;
			}
			return `at ${formattedTime} every month`;

		default:
			return "";
	}
}

/**
 * 日付に序数詞を付加（1st, 2nd, 3rd, 4th...）
 */
function getDayWithOrdinalSuffix(day: number): string {
	const suffix = ["th", "st", "nd", "rd"];
	const value = day % 100;
	return day + (suffix[(value - 20) % 10] || suffix[value] || suffix[0]);
}

/**
 * クイック選択のオプション一覧
 */
export const quickOptions: QuickTimeOption[] = [
	{ category: "relative", label: "10分後", value: "in 10 minutes" },
	{ category: "relative", label: "15分後", value: "in 15 minutes" },
	{ category: "relative", label: "30分後", value: "in 30 minutes" },
	{ category: "relative", label: "45分後", value: "in 45 minutes" },
	{ category: "relative", label: "1時間後", value: "in 1 hour" },
	{ category: "relative", label: "2時間後", value: "in 2 hours" },
	{ category: "relative", label: "3時間後", value: "in 3 hours" },
	{ category: "relative", label: "6時間後", value: "in 6 hours" },
	{ category: "tomorrow", label: "明日の朝9時", value: "at 9am tomorrow" },
	{ category: "tomorrow", label: "明日の昼12時", value: "at 12pm tomorrow" },
	{ category: "tomorrow", label: "明日の夕方6時", value: "at 6pm tomorrow" },
];

/**
 * 曜日の選択肢
 */
export const weekdayOptions = [
	{ value: "Monday", label: "月曜日" },
	{ value: "Tuesday", label: "火曜日" },
	{ value: "Wednesday", label: "水曜日" },
	{ value: "Thursday", label: "木曜日" },
	{ value: "Friday", label: "金曜日" },
	{ value: "Saturday", label: "土曜日" },
	{ value: "Sunday", label: "日曜日" },
];
