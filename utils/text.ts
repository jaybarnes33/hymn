export const capitalizeFirstLetter = (text: string, all = false) => {
  console.log(all);
  if (!text) return text;
  const firstChar = text.charAt(0);
  // Handle Twi epsilon

  return all
    ? text.replaceAll("ε", "Ɛ")
    : firstChar == "ε"
    ? "Ɛ" + text.slice(1)
    : firstChar.toUpperCase() + text.slice(1);
};
