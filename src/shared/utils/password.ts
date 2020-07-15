import { Md5 } from "md5-typescript";
const TOKEN = "$NVNVBFT&mm";

const generateNumericRandom = (length?: number): string => {
  length = length || 7;
  return Math.random()
    .toString()
    .substring(2, length + 2);
};

const generatePassword = async (password: string): Promise<string> => {
  return await Md5.init(`${password}${TOKEN}`).toString();
};

export { generatePassword, generateNumericRandom };
