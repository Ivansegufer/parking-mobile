import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonicModule, NavController } from "@ionic/angular";
import { ISignupRequest } from "../interfaces/requests/signup.request";
import { AuthService } from "src/app/services/auth.service";
import { PasswordValidator } from "./validators/password.validator";
import { CommonModule } from "@angular/common";
import { CommonService } from "src/app/services/common.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.page.html',
    styleUrls: ['./signup.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class SignupPage {

    public signupGroup: FormGroup;

    public constructor(
        private readonly navCtrl: NavController,
        private readonly commonService: CommonService,
        private readonly authService: AuthService,
        private readonly formBuilder: FormBuilder,
    )
    {
        this.signupGroup = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['']
        }, { validators: PasswordValidator.MatchPassword });
    }

    public async handleSignup()
    {
        const signupRequest: ISignupRequest = {
            name: this.signupGroup.get('name')!.value,
            email: this.signupGroup.get('email')!.value,
            profileImage: null,
            password: this.signupGroup.get('password')!.value
        };

        this.authService.signup(signupRequest)
            .subscribe({
                next: _ => {
                    this.navCtrl.navigateRoot(['auth/login'])
                        .then(_ => {
                            this.commonService.showToast("Usuario creado con éxito");
                        });
                },
                error: (e: HttpErrorResponse) => {
                    let message = "Hubo un error al registrar el usuario";
                    if (e.status > 0) {
                        message = e.error.message as string;
                    }
                    this.commonService.showToast(message);
                }
            });
    }
}