/**
 * @file useDebounce.ts
 * @description Custom hook for debouncing values to reduce API calls and improve UX
 * @TDD-Phase GREEN (ST-4.1.2)
 */

import { useEffect, useState } from "react";

/**
 * Debounces a value by delaying its update until after the specified delay
 *
 * @template T - The type of value to debounce
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (recommended: 300ms for input)
 * @returns The debounced value
 *
 * @example
 * ```tsx
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 *
 * useEffect(() => {
 *   // This will only run after user stops typing for 300ms
 *   searchAPI(debouncedSearchTerm);
 * }, [debouncedSearchTerm]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		// Set up timeout to update debounced value after delay
		const timeoutId = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Clean up timeout if value changes before delay completes
		return () => {
			clearTimeout(timeoutId);
		};
	}, [value, delay]);

	return debouncedValue;
}
