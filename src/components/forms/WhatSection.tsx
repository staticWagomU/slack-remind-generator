import { Textarea } from "../ui/Textarea";

interface WhatSectionProps {
	value?: string;
	onChange?: (value: string) => void;
	error?: string;
}

export function WhatSection({ value, onChange, error }: WhatSectionProps) {
	const maxLength = 500;
	const currentLength = value?.length || 0;

	return (
		<div className="space-y-2">
			<Textarea
				label="リマインダーメッセージ"
				placeholder="リマインダーの内容を入力してください..."
				value={value}
				onChange={onChange}
				error={error}
				required
				rows={4}
				helperText="メンション (@username, @here など) や改行も使用できます"
			/>

			<div className="flex justify-between items-center text-sm">
				<div className="text-slate-500">複数行のテキスト、メンション対応</div>
				<div
					className={`text-sm ${
						currentLength > maxLength
							? "text-red-600"
							: currentLength > maxLength * 0.8
								? "text-amber-600"
								: "text-slate-500"
					}`}
				>
					{currentLength}/{maxLength}
				</div>
			</div>

			{value && (
				<div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-md">
					<h4 className="text-sm font-medium text-slate-700 mb-2">
						プレビュー
					</h4>
					<div className="text-sm text-slate-600 whitespace-pre-wrap">
						{value}
					</div>
				</div>
			)}
		</div>
	);
}
