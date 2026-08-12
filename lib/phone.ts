/**
 * Normalizes a phone number into the international, plus-free digit string
 * WhatsApp's wa.me links require. Egyptian mobile numbers are usually typed
 * in local format (leading 0, e.g. "01020913417") — wa.me needs the country
 * code instead of that leading 0 (e.g. "201020913417"), or it reports the
 * number as not existing on WhatsApp even though it's valid.
 */
export function toWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return `20${digits.slice(1)}`;
  if (digits.startsWith("20")) return digits;
  return digits;
}
