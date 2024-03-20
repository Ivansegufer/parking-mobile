import { AbstractControl } from "@angular/forms";

export class PasswordValidator {
    public static MatchPassword(AC: AbstractControl): null {
        const password = AC.get('password')!.value;
        const confirmPassword = AC.get('confirmPassword')!.value;
        if (password !== confirmPassword) {
            AC.get('confirmPassword')!.setErrors({MatchPassword: true})
        }

        return null;
    }
}