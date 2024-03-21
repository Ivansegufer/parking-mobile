export interface IUpdateEstablishmentRequest {
    id: number;
    name: string;
    description: string;
    address: string;
    totalStands: number;
    standRowsJson: string;
    standColumnsJson: string;
}