import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { ILoginRequest } from "../pages/login/interfaces/requests/login.request";
import { ISignupRequest } from "../pages/login/interfaces/requests/signup.request";
import { NavController } from "@ionic/angular";
import { Preferences } from "@capacitor/preferences";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authUrl = `${environment.baseUrl}/auth`;

    public constructor(
        private readonly navCtrl: NavController,
        private readonly http: HttpClient
    ) { }

    public login(loginPayload: ILoginRequest): Observable<any>
    {
        const loginUrl = `${this.authUrl}/login`;
        return this.http.post(loginUrl, loginPayload);
    }

    public signup(signupPayload: ISignupRequest): Observable<any>
    {
        const signupUrl = `${this.authUrl}/signup`;
        return this.http.post(signupUrl, signupPayload);
    }

    public async createSession(id: string, value: string) {
        await Preferences.set({
            key: id,
            value
        });
    }

    public async closeSession() {
        await Preferences.clear();
        this.navCtrl.navigateRoot('/auth/login');
    }

    public async getSession(id: string) {
        const item = await Preferences.get({
            key: id,
        });
        return item.value;
    }
}