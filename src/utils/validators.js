export const isValidBennettEmail = (email) => {
  if (!email) return false;
  return email.trim().toLowerCase().endsWith('@bennett.edu.in');
};

export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};