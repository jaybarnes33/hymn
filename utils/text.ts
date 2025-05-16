export const capitalizeFirstLetter = (text: string) => {
  if (!text) return text;
  const firstChar = text.charAt(0);
  // Handle Twi epsilon
  if (firstChar == "ε") return "Ɛ" + text.slice(1);
  return firstChar.toUpperCase() + text.slice(1);
};
