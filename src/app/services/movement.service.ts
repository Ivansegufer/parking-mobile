import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ICreateMovementRequest } from "../pages/tabs/movement/interfaces/requests/create-movement.request";
import { IUpdateMovementRequest } from "../pages/tabs/movement/interfaces/requests/update-movement.request";

@Injectable({
    providedIn: 'root'
})
export class MovementService {
    private movementUrl = `${environment.baseUrl}/movement`;

    public constructor(
        private readonly http: HttpClient
    ) { }

    public getAllActivesByUserId(userId: number): Observable<any>
    {
        const getUrl = `${this.movementUrl}?user_id=${userId}`;
        return this.http.get(getUrl);
    }

    public create(createMovement: ICreateMovementRequest): Observable<any>
    {
        return this.http.post(this.movementUrl, createMovement);
    }

    public update(updateMovement: IUpdateMovementRequest): Observable<any>
    {
        return this.http.patch(this.movementUrl, updateMovement);
    }
}