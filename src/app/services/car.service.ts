import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ICreateCarRequest } from "../pages/tabs/movement/interfaces/requests/create-car.request";
import { IUpdateCarRequest } from "../pages/tabs/movement/interfaces/requests/update-car.request";

@Injectable({
    providedIn: 'root'
})
export class CarService {
    private carUrl = `${environment.baseUrl}/car`;

    public constructor(
        private readonly http: HttpClient
    ) { }

    public getByPlateNumber(userId: number, plateNumber: string): Observable<any> {
        const getUrl = `${this.carUrl}?user_id=${userId}&plate_number=${plateNumber}`;
        return this.http.get(getUrl);
    }

    public create(createCar: ICreateCarRequest): Observable<any> {
        return this.http.post(this.carUrl, createCar);
    }

    public update(updateCar: IUpdateCarRequest): Observable<any> {
        return this.http.put(this.carUrl, updateCar);
    }
}