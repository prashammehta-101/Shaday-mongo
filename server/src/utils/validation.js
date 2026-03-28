export const normalizeEmail = (email = "") => email.trim().toLowerCase();

export const isValidEmail = (email = "") => {
  const normalized = normalizeEmail(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
};

export const isValidPhone = (phone = "") => /^[6-9]\d{9}$/.test(phone.trim());

export const isValidPassword = (password = "") => {
  const hasCapital = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const numberCount = (password.match(/\d/g) || []).length;
  return password.length >= 8 && hasCapital && hasSpecial && numberCount >= 3;
};
