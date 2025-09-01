import { type TimeConversionRule } from "../types/reminder";

export const timeConversionRules: TimeConversionRule[] = [
	// 相対時間 - 分
	{
		pattern: /(\d+)分後/,
		convert: (match) => `in ${match[1]} minutes`,
		category: "relative",
	},
	{
		pattern: /(\d+)分/,
		convert: (match) => `in ${match[1]} minutes`,
		category: "relative",
	},

	// 相対時間 - 時間
	{
		pattern: /(\d+)時間後/,
		convert: (match) => `in ${match[1]} hours`,
		category: "relative",
	},
	{
		pattern: /(\d+)時間/,
		convert: (match) => `in ${match[1]} hours`,
		category: "relative",
	},

	// 相対時間 - 日
	{
		pattern: /(\d+)日後/,
		convert: (match) => `in ${match[1]} days`,
		category: "relative",
	},

	// 絶対時刻
	{
		pattern: /(\d{1,2}):(\d{2})/,
		convert: (match) => `at ${match[1]}:${match[2]}`,
		category: "absolute",
	},
	{
		pattern: /午前(\d{1,2})時/,
		convert: (match) => `at ${match[1]}am`,
		category: "absolute",
	},
	{
		pattern: /午後(\d{1,2})時/,
		convert: (match) => `at ${match[1]}pm`,
		category: "absolute",
	},

	// 日付
	{
		pattern: /(\d{4})年(\d{1,2})月(\d{1,2})日/,
		convert: (match) => `on ${match[2]}/${match[3]}/${match[1]}`,
		category: "absolute",
	},
	{
		pattern: /(\d{1,2})月(\d{1,2})日/,
		convert: (match) => {
			const currentYear = new Date().getFullYear();
			return `on ${match[1]}/${match[2]}/${currentYear}`;
		},
		category: "absolute",
	},

	// 自然言語
	{
		pattern: /明日/,
		convert: () => "tomorrow",
		category: "natural",
	},
	{
		pattern: /今日/,
		convert: () => "today",
		category: "natural",
	},
	{
		pattern: /月曜日?/,
		convert: () => "Monday",
		category: "natural",
	},
	{
		pattern: /火曜日?/,
		convert: () => "Tuesday",
		category: "natural",
	},
	{
		pattern: /水曜日?/,
		convert: () => "Wednesday",
		category: "natural",
	},
	{
		pattern: /木曜日?/,
		convert: () => "Thursday",
		category: "natural",
	},
	{
		pattern: /金曜日?/,
		convert: () => "Friday",
		category: "natural",
	},
	{
		pattern: /土曜日?/,
		convert: () => "Saturday",
		category: "natural",
	},
	{
		pattern: /日曜日?/,
		convert: () => "Sunday",
		category: "natural",
	},

	// 繰り返し
	{
		pattern: /毎日/,
		convert: () => "every day",
		category: "recurring",
	},
	{
		pattern: /平日/,
		convert: () => "every weekday",
		category: "recurring",
	},
	{
		pattern: /毎週月曜日?/,
		convert: () => "every Monday",
		category: "recurring",
	},
	{
		pattern: /毎週火曜日?/,
		convert: () => "every Tuesday",
		category: "recurring",
	},
	{
		pattern: /毎週水曜日?/,
		convert: () => "every Wednesday",
		category: "recurring",
	},
	{
		pattern: /毎週木曜日?/,
		convert: () => "every Thursday",
		category: "recurring",
	},
	{
		pattern: /毎週金曜日?/,
		convert: () => "every Friday",
		category: "recurring",
	},
	{
		pattern: /毎週土曜日?/,
		convert: () => "every Saturday",
		category: "recurring",
	},
	{
		pattern: /毎週日曜日?/,
		convert: () => "every Sunday",
		category: "recurring",
	},
	{
		pattern: /毎月/,
		convert: () => "every month",
		category: "recurring",
	},
];
