import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { APP_ERROR_MESSAGES, localizeApiErrorMessage, localizeApiValidationMessage } from "@/src/constants/error-messages";
import { ApiClientError } from "./api-client";

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
    return APP_ERROR_MESSAGES.generic;
  }

  if (error.details) {
    let mappedAny = false;

    for (const [serverField, messages] of Object.entries(error.details)) {
      const formField = (fieldMap[serverField] ?? serverField) as Path<TFieldValues>;
      const message = Array.isArray(messages) ? messages[0] : messages;
      if (message) {
        setError(formField, {
          message: localizeApiValidationMessage(serverField, message),
        });
        mappedAny = true;
      }
    }

    if (mappedAny) return null;
  }

  return localizeApiErrorMessage(error.message, error.status, error.code);
}
