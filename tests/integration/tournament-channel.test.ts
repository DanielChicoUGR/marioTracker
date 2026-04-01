import { describe, expect, it, vi } from "vitest";

describe("realtime wiring", () => {
  it("encadena channel → on → subscribe (API encadenable)", () => {
    const subscribe = vi.fn();
    const mockChannel = {
      on: vi.fn().mockReturnThis(),
      subscribe,
    };
    const channel = vi.fn().mockReturnValue(mockChannel);

    const client = { channel };
    client.channel("tournament:test").on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "tournaments",
        filter: "id=eq.x",
      },
      () => {},
    ).subscribe();

    expect(channel).toHaveBeenCalledWith("tournament:test");
    expect(mockChannel.on).toHaveBeenCalled();
    expect(subscribe).toHaveBeenCalled();
  });
});
