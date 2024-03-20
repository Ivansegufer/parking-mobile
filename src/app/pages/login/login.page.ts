import { Component } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { IonicModule, NavController } from "@ionic/angular";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ILoginRequest } from "./interfaces/requests/login.request";
import { HttpErrorResponse } from "@angular/common/http";
import { CommonService } from "src/app/services/common.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class LoginPage {

    public passwordVisibility: boolean = false;
    public loginGroup: FormGroup;

    public constructor(
        private readonly navCtrl: NavController,
        private readonly commonService: CommonService,
        private readonly authService: AuthService,
        private readonly formBuilder: FormBuilder
    )
    {
        this.loginGroup = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    public changePasswordVisibility() {
        this.passwordVisibility = !this.passwordVisibility;
    }

    public handleSignupClick()
    {
        this.navCtrl.navigateRoot(['auth/signup'])
    }

    public handleLogin()
    {
        const loginRequest: ILoginRequest = {
            email: this.loginGroup.get('email')!.value,
            password: this.loginGroup.get('password')!.value
        }

        this.authService.login(loginRequest)
            .subscribe({
                next: (res) => {
                    this.authService.createSession('user', JSON.stringify(res))
                        .then(_ => this.navCtrl.navigateRoot(''));
                },
                error: (e: HttpErrorResponse) => {
                    let message = "Hubo un error al iniciar sesión";
                    if (e.status > 0) {
                        message = e.error.message as string;
                    }
                    this.commonService.showToast(message);
                }
            });
    }
}