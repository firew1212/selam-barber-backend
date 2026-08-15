export declare enum BarberStatusDto {
    AVAILABLE = "AVAILABLE",
    BUSY = "BUSY",
    UNAVAILABLE = "UNAVAILABLE",
    VACATION = "VACATION"
}
export declare class UpdateBarberStatusDto {
    status: BarberStatusDto;
}
