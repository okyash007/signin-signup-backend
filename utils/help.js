export const generatePassword = () => Math.random().toString(36).slice(-8);

export function generateUsername(name) {
  const cleanedName = name.replace(/\s+/g, "").toLowerCase();

  const randomNumbers = Math.floor(Math.random() * 900) + 100;

  const username = cleanedName + randomNumbers;

  return username;
}
