import {
  IsEnum,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';


export enum PaymentTypeDto {
  DEPOSIT = 'DEPOSIT',
  FINAL = 'FINAL',
}


export enum PaymentMethodDto {
  TELEBIRR = 'TELEBIRR',
  BANK_TRANSFER = 'BANK_TRANSFER',
}


export class CreatePaymentDto {

  @IsString()
  appointmentId!: string;


  @IsNumber()
  @Min(1)
  amount!: number;


  @IsEnum(PaymentTypeDto)
  paymentType!: PaymentTypeDto;


  @IsEnum(PaymentMethodDto)
  paymentMethod!: PaymentMethodDto;

}