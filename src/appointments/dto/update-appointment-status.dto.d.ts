export declare enum AppointmentStatusDto {
    CONFIRMED = "CONFIRMED",
    IN_QUEUE = "IN_QUEUE",
    IN_SERVICE = "IN_SERVICE",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    NO_SHOW = "NO_SHOW"
}
export declare class UpdateAppointmentStatusDto {
    status: AppointmentStatusDto;
}
