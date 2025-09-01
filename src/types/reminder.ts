export type WhoType =
	| "me"
	| { type: "user"; username: string }
	| { type: "channel"; channelName: string };

export interface ReminderConfig {
	id: string;
	who: WhoType;
	what: string;
	when: string;
	createdAt: Date;
}

export interface TimeInput {
	type: "relative" | "absolute" | "natural" | "recurring";
	value: string;
	originalInput: string;
}

export interface TimeConversionRule {
	pattern: RegExp;
	convert: (match: RegExpMatchArray) => string;
	category: "relative" | "absolute" | "natural" | "recurring";
}

export interface ValidationError {
	field: keyof ReminderConfig;
	message: string;
	severity: "error" | "warning";
}

export interface AppState {
	currentReminder: Partial<ReminderConfig>;
	history: ReminderConfig[];
	validationErrors: ValidationError[];
	isLoading: boolean;
}
