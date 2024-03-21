import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonicModule, NavController } from "@ionic/angular";
import { AuthService } from "../../../../services/auth.service";
import { EstablishmentService } from "../../../../services/establishment.service";
import { User } from "../../../../models/user.model";
import { ICreateEstablishmentRequest } from "../interfaces/requests/create-establishment.request";
import { HttpErrorResponse } from "@angular/common/http";
import { CommonService } from "../../../../services/common.service";

@Component({
    selector: 'app-create-establishment',
    templateUrl: './create-establishment.page.html',
    styleUrls: ['./create-establishment.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class CreateEstablishmentPage {

    public establishmentGroup: FormGroup;
    public columns: string[] = ["A"];
    public rows: number[] = [1];

    public constructor(
        private readonly navCtrl: NavController,
        private readonly authService: AuthService,
        private readonly commonService: CommonService,
        private readonly establishmentService: EstablishmentService,
        private readonly formBuilder: FormBuilder
    )
    {
        this.establishmentGroup = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
            description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
            address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
            totalStands: [1, [Validators.required, Validators.min(1), Validators.max(500)]],
            fare: [0.05, [Validators.required, Validators.min(0.01), Validators.max(50)]]
        });
    }

    public changeTotalStands(): void {
        this.establishmentGroup.get('totalStands')!
            .setValue(this.rows.length * this.columns.length);
    }

    public addColumn(): void {
        const length = this.columns.length;
        const nextValueAscii = this.columns[length - 1].charCodeAt(0) + 1;
        const nextValue = String.fromCharCode(nextValueAscii);
        this.columns = [...this.columns, nextValue];
        this.changeTotalStands();
    }

    public addRow(): void {
        const length = this.rows.length;
        const nextValue = this.rows[length - 1] + 1;
        this.rows = [...this.rows, nextValue];
        this.changeTotalStands();
    }

    public removeColumn(): void {
        if (this.columns.length <= 1) return;
        this.columns.pop();
        this.changeTotalStands();
    }

    public removeRow(): void {
        if (this.rows.length <= 1) return;
        this.rows.pop();
        this.changeTotalStands();
    }

    public handleCreate() {
      this.authService.getSession('user')
        .then(userJson => {
          const user = JSON.parse(userJson!) as User;
          const newEstablishment: ICreateEstablishmentRequest = {
            userId: user.id,
            name: this.establishmentGroup.get('name')!.value,
            description: this.establishmentGroup.get('description')!.value,
            address: this.establishmentGroup.get('address')!.value,
            totalStands: this.establishmentGroup.get('totalStands')!.value,
            fare: this.establishmentGroup.get('fare')!.value,
            standRowsJson: JSON.stringify(this.rows),
            standColumnsJson: JSON.stringify(this.columns)
          };

          this.establishmentService.create(newEstablishment)
            .subscribe({
                next: _ => {
                    this.navCtrl.navigateRoot(['establishment'])
                        .then(_ => {
                            this.commonService.showToast("Establecimiento creado con éxito");
                        });
                },
                error: (e: HttpErrorResponse) => {
                    let message = "Hubo un error al crear el establecimiento";
                    if (e.status > 0) {
                        message = e.error.message as string;
                    }
                    this.commonService.showToast(message);
                }
            });
        }); 
    }
}