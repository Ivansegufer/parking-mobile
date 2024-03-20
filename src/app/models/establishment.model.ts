export class Establishment {
    public constructor(
        public id: number,
        public name: string,
        public description: string,
        public address: string,
        public totalStands: number,
        public totalOccupiedStands: number,
        public fare: number
    ) {}
}