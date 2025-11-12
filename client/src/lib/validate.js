export const isValidEmail = (email) => /\S+@\S+\.\S+/.test(String(email).trim());
export const isValidPassword = (s) => s?.length >= 6 && /[A-Z]/.test(s) && /[a-z]/.test(s);
export const isValidAmount = (n) => Number.isFinite(Number(n)) && Number(n) > 0;
export const isValidDate = (d) => Number.isFinite(new Date(d).getTime());
export const isNonEmpty = (v) => String(v ?? "").trim().length > 0;

export const validateTransaction = ({ type, category, amount, date }) => {
  const errors = {};
  if (!["income", "expense"].includes(type)) errors.type = "Type must be income or expense.";
  if (!isNonEmpty(category)) errors.category = "Category is required.";
  if (!isValidAmount(amount)) errors.amount = "Amount must be greater than 0.";
  if (!isValidDate(date)) errors.date = "Please select a valid date.";
  return errors;
};
