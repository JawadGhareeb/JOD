import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiClientError } from "./api-client";

const GENERIC_ERROR_MESSAGE = "حدث خطأ غير متوقع. حاول مرة أخرى.";

/**
 * Maps a 422 validation error's field-level `details` onto react-hook-form
 * fields via `setError`, so "email already registered" shows under the email
 * input instead of a generic alert. `fieldMap` translates a server field name
 * to the form's field name where they differ (e.g. `password_confirmation`
 * on the wire vs `confirmPassword` in the form).
 *
 * Returns a message to show as a top-level error when there's nothing
 * field-specific to attach it to (wrong password, network failure, etc.) —
 * `null` means the error was fully handled by `setError` already.
 */
export function applyApiFormErrors<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
  fieldMap: Partial<Record<string, Path<TFieldValues>>> = {},
): string | null {
  if (!(error instanceof ApiClientError)) {
    return GENERIC_ERROR_MESSAGE;
  }

  if (error.code === "account_inactive") {
    return "هذا الحساب غير مفعّل. تواصل مع الإدارة.";
  }

  if (error.code === "organization_inactive") {
    return "حساب المنظمة غير مفعّل أو غير موثّق بعد.";
  }

  if (error.details) {
    let mappedAny = false;

    for (const [serverField, messages] of Object.entries(error.details)) {
      const formField = (fieldMap[serverField] ?? serverField) as Path<TFieldValues>;
      const message = messages[0];
      if (message) {
        setError(formField, { message });
        mappedAny = true;
      }
    }

    if (mappedAny) return null;
  }

  return error.message;
}
