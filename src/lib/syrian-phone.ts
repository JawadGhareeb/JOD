export const SYRIAN_PHONE_PREFIX = "+963";
export const SYRIAN_MOBILE_PATTERN = /^\+9639\d{8}$/;
export const SYRIAN_MOBILE_ERROR =
  "أدخل 9 أرقام بعد +963 ويجب أن يبدأ رقم الموبايل بالرقم 9، مثال: +963957961434.";

export function getSyrianPhoneSubscriber(value: string | null | undefined): string {
  const raw = (value ?? "").trim();
  if (!raw) return "";

  if (raw.startsWith(SYRIAN_PHONE_PREFIX)) {
    return raw.slice(SYRIAN_PHONE_PREFIX.length).replace(/\D/g, "").slice(0, 9);
  }

  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("963")) return digits.slice(3, 12);
  if (digits.startsWith("0")) return digits.slice(1, 10);
  return digits.slice(0, 9);
}

export function normalizeSyrianMobile(value: string | null | undefined): string {
  const subscriber = getSyrianPhoneSubscriber(value);
  return subscriber ? `${SYRIAN_PHONE_PREFIX}${subscriber}` : "";
}

export function isValidSyrianMobile(value: string | null | undefined): boolean {
  return SYRIAN_MOBILE_PATTERN.test((value ?? "").trim());
}
