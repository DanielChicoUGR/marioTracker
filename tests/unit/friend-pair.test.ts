import { describe, expect, it } from "vitest";

import { orderFriendPair } from "@/lib/friendPair";

describe("orderFriendPair", () => {
  it("ordena lexicográficamente", () => {
    const a = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
    const b = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
    expect(orderFriendPair(b, a)).toEqual([a, b]);
  });
});
