import bcrypt from "bcryptjs";

const saltRounds = 10;

export function encryptPassword(password: string) {
  const hash = bcrypt.hashSync(password, saltRounds);
  return hash;
}
