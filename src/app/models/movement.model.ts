export class Movement {
    public constructor(
        public carId: number,
        public movementId: number,
        public plateNumber: string,
        public model: string,
        public year: number,
        public color: string,
        public enterDate: string,
        public establishmentName: string,
        public fare: number
    ) {}
}