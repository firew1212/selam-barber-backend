import { IsEnum } from 'class-validator';

export enum QueueStatusDto {
  WAITING = 'WAITING',
  CALLED = 'CALLED',
  IN_SERVICE = 'IN_SERVICE',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

export class UpdateQueueStatusDto {
  @IsEnum(QueueStatusDto)
  status!: QueueStatusDto;
}