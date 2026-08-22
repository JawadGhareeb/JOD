export interface UpdateProfileInput {
  name: string;
  email: string;
  phone?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  password: string;
  password_confirmation: string;
}
