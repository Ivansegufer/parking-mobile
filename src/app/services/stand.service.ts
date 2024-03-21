import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ICreateMovementRequest } from "../pages/tabs/movement/interfaces/requests/create-movement.request";
import { IUpdateMovementRequest } from "../pages/tabs/movement/interfaces/requests/update-movement.request";

@Injectable({
    providedIn: 'root'
})
export class StandService {
    private standUrl = `${environment.baseUrl}/stand`;

    public constructor(
        private readonly http: HttpClient
    ) { }

    public getAllOccupiedStands(establishmentId: number): Observable<any>
    {
        const getUrl = `${this.standUrl}?establishment_id=${establishmentId}`;
        return this.http.get(getUrl);
    }
}