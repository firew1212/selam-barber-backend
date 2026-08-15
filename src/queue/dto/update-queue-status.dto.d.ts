export declare enum QueueStatusDto {
    WAITING = "WAITING",
    CALLED = "CALLED",
    IN_SERVICE = "IN_SERVICE",
    COMPLETED = "COMPLETED",
    NO_SHOW = "NO_SHOW"
}
export declare class UpdateQueueStatusDto {
    status: QueueStatusDto;
}
