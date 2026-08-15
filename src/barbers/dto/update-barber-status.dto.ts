import { IsEnum } from 'class-validator';

export enum BarberStatusDto {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  UNAVAILABLE = 'UNAVAILABLE',
  VACATION = 'VACATION',
}

export class UpdateBarberStatusDto {
  @IsEnum(BarberStatusDto)
  status!: BarberStatusDto;
}