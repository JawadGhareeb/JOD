export interface UpdateProfileInput {
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  bio?: string | null;
}

export interface ChangePasswordInput {
  currentPassword: string;
  code: string;
  password: string;
  password_confirmation: string;
}

export interface PasswordChangeVerificationPayload {
  verificationRequired: true;
  verificationCodeSent: boolean;
  expiresIn: number;
}
