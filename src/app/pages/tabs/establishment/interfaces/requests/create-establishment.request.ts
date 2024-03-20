export interface ICreateEstablishmentRequest {
    userId: number;
    name: string;
    description: string;
    address: string;
    totalStands: number;
    fare: number;
}