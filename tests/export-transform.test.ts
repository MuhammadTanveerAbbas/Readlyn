import { describe, it, expect } from "vitest";
import { computeExportTransform } from "@/lib/exportMultiFormat";

describe("Multi format export transform", () => {
  it("keeps the ratio at 1 for an identical frame", () => {
    const { ratio, offsetX, offsetY } = computeExportTransform(
      { width: 1080, height: 1080 },
      { width: 1080, height: 1080 },
    );
    expect(ratio).toBe(1);
    expect(offsetX).toBe(0);
    expect(offsetY).toBe(0);
  });

  it("scales down to fit a square frame and centers horizontally", () => {
    const { ratio, offsetX, offsetY } = computeExportTransform(
      { width: 800, height: 1100 },
      { width: 1080, height: 1080 },
    );
    expect(ratio).toBeCloseTo(1080 / 1100, 5);
    expect(offsetY).toBeCloseTo(0, 5);
    expect(offsetX).toBeGreaterThan(0);
    expect(offsetX * 2 + 800 * ratio).toBeCloseTo(1080, 5);
  });

  it("letterboxes an a4 artboard into a wide frame", () => {
    const { ratio, offsetX, offsetY } = computeExportTransform(
      { width: 800, height: 1100 },
      { width: 1920, height: 600 },
    );
    expect(ratio).toBeCloseTo(600 / 1100, 5);
    expect(offsetY).toBeCloseTo(0, 5);
    expect(offsetX).toBeGreaterThan(0);
    expect(1100 * ratio).toBeCloseTo(600, 5);
  });

  it("centers a square artboard in a story frame", () => {
    const { ratio, offsetX, offsetY } = computeExportTransform(
      { width: 1080, height: 1080 },
      { width: 1080, height: 1920 },
    );
    expect(ratio).toBe(1);
    expect(offsetX).toBe(0);
    expect(offsetY).toBe(420);
  });
});
