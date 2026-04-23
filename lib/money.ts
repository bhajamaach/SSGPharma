/** Show paise as INR with rupee symbol (locale aware). */
export function formatInrFromPaise(paise: number) {
  const negative = paise < 0;
  const absolutePaise = Math.abs(paise);
  const rupees = Math.floor(absolutePaise / 100);
  const decimals = String(absolutePaise % 100).padStart(2, "0");
  const integer = String(rupees);

  let grouped = integer;
  if (integer.length > 3) {
    const lastThree = integer.slice(-3);
    const leading = integer.slice(0, -3);
    const leadingGrouped = leading.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    grouped = `${leadingGrouped},${lastThree}`;
  }

  return `${negative ? "-" : ""}₹${grouped}.${decimals}`;
}

/** Parse "1250" or "1250.50" typed in a form into integer paise. */
export function parseRupeesToPaise(input: string) {
  const n = Number.parseFloat(input.replace(/,/g, "").trim());
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}
