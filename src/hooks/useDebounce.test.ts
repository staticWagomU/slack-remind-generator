/**
 * @file useDebounce.test.ts
 * @description Test suite for useDebounce hook - verifies 300ms delay behavior
 * @TDD-Phase RED (ST-4.1.1)
 */

import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
	it("should return initial value immediately", () => {
		const { result } = renderHook(() => useDebounce("initial", 300));
		expect(result.current).toBe("initial");
	});

	it("should debounce value changes with 300ms delay", async () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{
				initialProps: { value: "initial", delay: 300 },
			},
		);

		expect(result.current).toBe("initial");

		// Change value
		rerender({ value: "changed", delay: 300 });

		// Value should not change immediately
		expect(result.current).toBe("initial");

		// Wait for debounce delay
		await waitFor(
			() => {
				expect(result.current).toBe("changed");
			},
			{ timeout: 400 },
		);
	});

	it("should cancel previous timeout on rapid value changes", async () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{
				initialProps: { value: "initial", delay: 300 },
			},
		);

		// Rapid changes
		rerender({ value: "change1", delay: 300 });
		await new Promise((resolve) => setTimeout(resolve, 100));
		rerender({ value: "change2", delay: 300 });
		await new Promise((resolve) => setTimeout(resolve, 100));
		rerender({ value: "change3", delay: 300 });

		// Should still show initial during debounce period
		expect(result.current).toBe("initial");

		// Wait for full debounce delay
		await waitFor(
			() => {
				expect(result.current).toBe("change3");
			},
			{ timeout: 400 },
		);
	});

	it("should cleanup timeout on unmount", () => {
		vi.useFakeTimers();
		const { unmount } = renderHook(() => useDebounce("test", 300));

		// Unmount before debounce completes
		unmount();

		// Advance time - should not throw error
		expect(() => vi.advanceTimersByTime(300)).not.toThrow();

		vi.useRealTimers();
	});
});
