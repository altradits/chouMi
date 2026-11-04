// Stub: Ye₿ente wallets live in the main site (altradits/altradits), not here.
// The Security watch and the admin only need to know two things: whether
// wallets exist here (never) and what is owed (asked only when they do).
// Anything that reaches liabilities() is a bug: it fails loudly.
export const walletsOn = () => false;
export async function liabilities() {
  throw new Error("YeBente wallets live in the main site, not here.");
}
