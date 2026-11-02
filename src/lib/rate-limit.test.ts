import { describe, expect, it } from "bun:test";
import { enforceRateLimit } from "@/lib/rate-limit";

describe("rate limits", () => {
  it("allows requests up to the configured limit and then blocks the bucket", async () => {
    const identifier = crypto.randomUUID();
    const first = await enforceRateLimit("unit-test", identifier, 2, 60);
    const second = await enforceRateLimit("unit-test", identifier, 2, 60);
    const third = await enforceRateLimit("unit-test", identifier, 2, 60);

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
  });
});
