import { prisma } from "@db/prisma.js";

export const meal_voucher_8h_value = "meal_voucher_8h_value";
export const meal_voucher_6h_value = "meal_voucher_6h_value";

export async function getConfig(key: string) {
  const config = await prisma.configs.findUnique({
    select: {
      value: true,
      type: true,
    },
    where: {
      key,
    },
  });
  if (!config) {
    return "Invalid key";
  }

  if (config.type == "number") {
    return Number(config.value);
  }

  return config.value;
}
