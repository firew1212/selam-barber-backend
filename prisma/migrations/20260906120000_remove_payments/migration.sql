-- Drop the payment feature from databases created by earlier migrations.
ALTER TABLE "public"."Payment" DROP CONSTRAINT IF EXISTS "Payment_appointmentId_fkey";
DROP TABLE IF EXISTS "public"."Payment";
DROP TYPE IF EXISTS "public"."PaymentType";
DROP TYPE IF EXISTS "public"."PaymentMethod";
DROP TYPE IF EXISTS "public"."PaymentStatus";
