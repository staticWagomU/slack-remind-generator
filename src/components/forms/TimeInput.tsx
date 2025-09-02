import { useState, useRef, useCallback } from "react";
import {
	validateTimeInput,
	formatDisplayToHHMM,
	type TimeValidationResult,
} from "../../utils/timeValidation";
import { cn } from "../../lib/utils";

interface TimeInputProps {
	value: string;
	onChange: (value: string) => void;
	label?: string;
	placeholder?: string;
}

export function TimeInput({
	value,
	onChange,
	label = "時刻",
	placeholder = "時刻を入力",
}: TimeInputProps) {
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [validation, setValidation] = useState<TimeValidationResult>({
		isValid: true,
		errorMessage: "",
	});
	const inputRef = useRef<HTMLInputElement>(null);

	const validateAndFormat = useCallback((input: string) => {
		const result = validateTimeInput(input);
		setValidation(result);
		return result;
	}, []);

	const handleFocus = () => {
		setIsFocused(true);
		if (inputRef.current && value) {
			const hhmmValue = formatDisplayToHHMM(value);
			inputRef.current.value = hhmmValue;
		}
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setIsFocused(false);
		const input = e.target.value;

		if (input) {
			const result = validateAndFormat(input);
			if (result.isValid && result.formattedTime) {
				onChange(result.formattedTime);
				if (inputRef.current) {
					inputRef.current.value = result.formattedTime;
				}
			} else {
				if (inputRef.current) {
					inputRef.current.value = value;
				}
			}
		}

		setValidation({ isValid: true, errorMessage: "" });
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e || !e.target) return;

		const input = e.target.value;

		if (isFocused) {
			const numericInput = input.replace(/\D/g, "");
			if (numericInput.length <= 4) {
				e.target.value = numericInput;

				if (numericInput.length === 4) {
					const result = validateAndFormat(numericInput);
					if (!result.isValid) {
						setValidation(result);
					} else {
						setValidation({ isValid: true, errorMessage: "" });
					}
				} else {
					setValidation({ isValid: true, errorMessage: "" });
				}
			} else {
				e.target.value = numericInput.substring(0, 4);
			}
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.currentTarget.blur();
		}
	};

	const getPlaceholderText = () => {
		if (isFocused) {
			return "4桁で入力 (例: 1430)";
		}
		return `${placeholder} (例: 14:30)`;
	};

	return (
		<div className="space-y-2">
			{label && (
				<label className="text-sm font-medium text-slate-700">{label}</label>
			)}
			<div className="relative">
				<input
					ref={inputRef}
					type="text"
					defaultValue={value}
					onChange={handleChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					placeholder={getPlaceholderText()}
					className={cn(
						"block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm",
						!validation.isValid &&
							"border-red-500 focus:ring-red-500 focus:border-red-500",
					)}
					aria-label="時刻入力"
					aria-describedby={`time-input-help ${
						!validation.isValid ? "time-input-error" : ""
					}`}
					aria-invalid={!validation.isValid}
					role="textbox"
				/>
				{!validation.isValid && validation.errorMessage && (
					<p
						id="time-input-error"
						className="mt-1 text-sm text-red-600"
						role="alert"
					>
						{validation.errorMessage}
					</p>
				)}
				<p id="time-input-help" className="sr-only">
					{isFocused
						? "4桁の数値で時刻を入力してください。例: 1430は14時30分を表します。"
						: "時刻を入力してください。例: 14:30"}
				</p>
			</div>
		</div>
	);
}
