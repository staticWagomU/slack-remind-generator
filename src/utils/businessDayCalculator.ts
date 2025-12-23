import holidayJp from "@holiday-jp/holiday_jp";

/**
 * 指定した年月の最終営業日を計算する
 * 営業日 = 土日祝を除いた日
 */
export function getLastBusinessDay(year: number, month: number): Date {
	// 月末日を取得（翌月の0日目 = 当月の最終日）
	const lastDay = new Date(year, month, 0);

	// 月末から遡って営業日を探す
	const currentDate = new Date(lastDay);
	while (!isBusinessDay(currentDate)) {
		currentDate.setDate(currentDate.getDate() - 1);
	}

	return currentDate;
}

/**
 * 営業日かどうかを判定する
 */
export function isBusinessDay(date: Date): boolean {
	const dayOfWeek = date.getDay();

	// 土曜(6)または日曜(0)は営業日ではない
	if (dayOfWeek === 0 || dayOfWeek === 6) {
		return false;
	}

	// 祝日チェック
	if (holidayJp.isHoliday(date)) {
		return false;
	}

	return true;
}

/**
 * 年の選択肢を生成（現在年〜2年後まで）
 */
export function generateYearOptions(): Array<{ label: string; value: number }> {
	const currentYear = new Date().getFullYear();
	return [
		{ label: `${currentYear}年`, value: currentYear },
		{ label: `${currentYear + 1}年`, value: currentYear + 1 },
		{ label: `${currentYear + 2}年`, value: currentYear + 2 },
	];
}

/**
 * 月の選択肢を生成（1-12月）
 */
export function generateMonthOptions(): Array<{ label: string; value: number }> {
	return Array.from({ length: 12 }, (_, i) => ({
		label: `${i + 1}月`,
		value: i + 1,
	}));
}
