export const checkPasswordStrength = (pwd: string) => {
  const hasLength = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

  return { hasLength, hasUpper, hasLower, hasNumber, hasSpecial };
};

export type PasswordStrength = ReturnType<typeof checkPasswordStrength>;
