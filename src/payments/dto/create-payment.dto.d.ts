export declare enum PaymentTypeDto {
    DEPOSIT = "DEPOSIT",
    FINAL = "FINAL"
}
export declare enum PaymentMethodDto {
    TELEBIRR = "TELEBIRR",
    BANK_TRANSFER = "BANK_TRANSFER"
}
export declare class CreatePaymentDto {
    appointmentId: string;
    amount: number;
    paymentType: PaymentTypeDto;
    paymentMethod: PaymentMethodDto;
}
