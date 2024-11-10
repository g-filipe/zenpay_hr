-- CreateTable
CREATE TABLE "Configs" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Configs_pkey" PRIMARY KEY ("key")
);

INSERT INTO "Configs" VALUES ('meal_voucher_8h_value', '36.6', 'number'), ('meal_voucher_6h_value', '22.0', 'number')