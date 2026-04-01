/**
 * Normaliza par de UUIDs para comprobar orden (user_a < user_b).
 */
export function orderFriendPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}
