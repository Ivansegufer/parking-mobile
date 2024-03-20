import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { ICreateEstablishmentRequest } from "../pages/tabs/establishment/interfaces/requests/create-establishment.request";
import { IUpdateEstablishmentRequest } from "../pages/tabs/establishment/interfaces/requests/update-establishment.request";

@Injectable({
    providedIn: 'root'
})
export class EstablishmentService {
    private establishmentUrl = `${environment.baseUrl}/establishment`;

    public constructor(
        private readonly http: HttpClient
    ) { }

    public getAllByUserId(userId: number): Observable<any>
    {
        const getUrl = `${this.establishmentUrl}?user_id=${userId}`;
        return this.http.get(getUrl);
    }

    public create(createEstablishment: ICreateEstablishmentRequest): Observable<any>
    {
        return this.http.post(this.establishmentUrl, createEstablishment);
    }

    public update(updateEstablishment: IUpdateEstablishmentRequest): Observable<any>
    {
        return this.http.put(this.establishmentUrl, updateEstablishment);
    }
}