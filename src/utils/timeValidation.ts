export interface TimeValidationResult {
	isValid: boolean;
	errorMessage: string;
	formattedTime?: string;
}

export function validateTimeInput(input: string): TimeValidationResult {
	if (!input || input.trim() === "") {
		return {
			isValid: false,
			errorMessage: "時刻を入力してください",
		};
	}

	const cleanInput = input.replace(/\D/g, "");

	if (cleanInput.length === 0) {
		return {
			isValid: false,
			errorMessage: "数値のみ入力してください",
		};
	}

	let paddedInput: string;
	if (cleanInput.length === 1 || cleanInput.length === 2) {
		paddedInput = cleanInput.padStart(4, "0");
	} else if (cleanInput.length === 3) {
		paddedInput = `0${cleanInput}`;
	} else if (cleanInput.length === 4) {
		paddedInput = cleanInput;
	} else {
		return {
			isValid: false,
			errorMessage: "4桁で入力してください (例: 1430)",
		};
	}

	const hours = parseInt(paddedInput.substring(0, 2), 10);
	const minutes = parseInt(paddedInput.substring(2, 4), 10);

	if (hours > 23) {
		return {
			isValid: false,
			errorMessage: "時間は00-23の範囲で入力してください",
		};
	}

	if (minutes > 59) {
		return {
			isValid: false,
			errorMessage: "分は00-59の範囲で入力してください",
		};
	}

	const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

	return {
		isValid: true,
		errorMessage: "",
		formattedTime,
	};
}

export function formatHHMMToDisplay(hhmm: string): string {
	const cleanInput = hhmm.replace(/\D/g, "");

	if (cleanInput.length === 0) return "";

	let paddedInput: string;
	if (cleanInput.length === 1 || cleanInput.length === 2) {
		paddedInput = cleanInput.padStart(4, "0");
	} else if (cleanInput.length === 3) {
		paddedInput = `0${cleanInput}`;
	} else if (cleanInput.length === 4) {
		paddedInput = cleanInput;
	} else {
		return cleanInput.substring(0, 4);
	}

	const hours = paddedInput.substring(0, 2);
	const minutes = paddedInput.substring(2, 4);
	return `${hours}:${minutes}`;
}

export function formatDisplayToHHMM(display: string): string {
	return display.replace(/:/g, "");
}
