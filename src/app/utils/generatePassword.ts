export function generatePassword(length = 8) {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";

  const allChars = uppercase + lowercase + digits;

  let password = "";

  // Ensure password contains at least one char from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += digits[Math.floor(Math.random() * digits.length)];

  // Fill remaining length with random chars from all categories
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password to avoid predictable positions
  password = password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');

  return password;
}
