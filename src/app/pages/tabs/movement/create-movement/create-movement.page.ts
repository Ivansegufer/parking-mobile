import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonicModule, NavController } from "@ionic/angular";
import { MatStepperModule } from "@angular/material/stepper";
import { AuthService } from "../../../../services/auth.service";
import { EstablishmentService } from "../../../../services/establishment.service";
import { User } from "../../../../models/user.model";
import { Establishment } from "../../../../models/establishment.model";
import { CarService } from "../../../../services/car.service";
import { CommonService } from "../../../../services/common.service";
import { Car } from "../../../../models/car.model";
import { MatStepper } from "@angular/material/stepper";
import { IUpdateCarRequest } from "../interfaces/requests/update-car.request";
import { ICreateCarRequest } from "../interfaces/requests/create-car.request";
import { HttpErrorResponse } from "@angular/common/http";
import { MovementService } from "../../../../services/movement.service";
import { ICreateMovementRequest } from "../interfaces/requests/create-movement.request";
import * as moment from "moment";
import { StandService } from "../../../../services/stand.service";

@Component({
    selector: 'app-create-movement',
    templateUrl: './create-movement.page.html',
    styleUrls: ['./create-movement.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, MatStepperModule, ReactiveFormsModule]
})
export class CreateMovementPage implements OnInit, OnDestroy {

    public movementGroup: FormGroup;
    public carGroup: FormGroup;
    public establishmentGroup: FormGroup;
    public standGroup: FormGroup;

    public establishments: Establishment[] = [];
    public currentDateTime: Date = new Date();
    public establishmentSelected: Establishment | null = null;
    public carSearched: Car | null = null;
    public wasCarSearched: boolean = false;

    public standColumns: string[] = [];
    public standRows: number[] = [];
    public occupiedStandCodes: string[] = [];

    private intervalId: number | null = null;
    private userLogged: User | null = null;

    @ViewChild('stepper')
    public stepper!: MatStepper;

    public constructor(
        private readonly commonService: CommonService,
        private readonly navCtrl: NavController,
        private readonly authService: AuthService,
        private readonly carService: CarService,
        private readonly movementService: MovementService,
        private readonly establishmentService: EstablishmentService,
        private readonly standService: StandService,
        private readonly formBuilder: FormBuilder
    )
    {
        this.movementGroup = this.formBuilder.group({
            carId: [null, [Validators.required]],
            establishmentId: [null, [Validators.required]],
            enterDate: ['', [Validators.required]]
        });

        this.carGroup = this.formBuilder.group({
            plateNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
            model: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
            year: [2000, [Validators.required]],
            color: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]]
        });

        this.establishmentGroup = this.formBuilder.group({
            id: [null, [Validators.required]]
        });

        this.standGroup = this.formBuilder.group({
            code: ['', [Validators.required]]
        });

        this.carGroup.get('model')!.disable();
        this.carGroup.get('year')!.disable();
        this.carGroup.get('color')!.disable();
    }

    public ngOnInit(): void {
        this.authService.getSession('user')
          .then(userJson => {
            const user = JSON.parse(userJson!) as User;
            this.userLogged = user;
            this.establishmentService.getAllByUserId(user.id)
              .subscribe(res => {
                this.establishments = (res as Establishment[])
                    .filter(establishment => establishment.totalStands !== establishment.totalOccupiedStands);
            });
          });

        this.intervalId = window.setInterval(() => {
          this.currentDateTime = new Date();
        }, 1000)
    }

    public ngOnDestroy(): void {
        window.clearInterval(this.intervalId!);
    }

    public nextStepPreviousCar(): void {
        if (!this.carGroup.valid) {
            this.commonService.showToast("Se debe completar los datos del carro");
            return;
        }

        if (!this.wasCarSearched) {
            this.commonService.showToast("Se debe buscar el vehículo");
            return;
        }

        if (this.carSearched) {
            const updateRequest: IUpdateCarRequest = {
                id: this.carSearched.id,
                color: this.carGroup.get('color')!.value
            };
            this.carService.update(updateRequest)
                .subscribe({
                    next: _ => {
                        this.commonService.showToast("Carro actualizado con éxito");
                        this.stepper.next();
                    },
                    error: (e: HttpErrorResponse) => {
                        let message = "Hubo un error al actualizar el carro";
                        if (e.status > 0) {
                            message = e.error.message as string;
                        }
                        this.commonService.showToast(message);
                    }
                });
        } else {
            const createRequest: ICreateCarRequest = {
                userId: this.userLogged!.id,
                plateNumber: this.carGroup.get('plateNumber')!.value,
                model: this.carGroup.get('model')!.value,
                year: this.carGroup.get('year')!.value,
                color: this.carGroup.get('color')!.value
            };
            this.carService.create(createRequest)
                .subscribe({
                    next: _ => {
                        this.carService.getByPlateNumber(this.userLogged!.id, 
                            this.carGroup.get('plateNumber')!.value)
                            .subscribe(res => {
                                this.carSearched = res;
                                this.commonService.showToast("Carro creado con éxito");
                                this.stepper.next();
                            });
                    },
                    error: (e: HttpErrorResponse) => {
                        let message = "Hubo un error al crear el carro";
                        if (e.status > 0) {
                            message = e.error.message as string;
                        }
                        this.commonService.showToast(message);
                    }
                });
        }
    }

    public searchCar(): void {
        if (!this.carGroup.get('plateNumber')!.valid) {
            this.commonService.showToast("Debe ingresar un número de placa válido");
            return;
        }

        this.carService.getByPlateNumber(this.userLogged!.id, 
            this.carGroup.get('plateNumber')!.value)
            .subscribe({
                next: res => {
                    this.carSearched = res;
                    this.commonService.showToast("Carro encontrado");
                    this.carGroup.get('plateNumber')!.disable();
                    this.setCarInfo();
                    this.enableCarControls();
                },
                error: _ => {
                    this.commonService.showToast("No existe carro con esa placa, se deberá de ingresar uno nuevo");
                    this.carGroup.get('plateNumber')!.disable();
                    this.enableCarControls();
                }
            })
        this.wasCarSearched = true;
    }

    private setCarInfo(): void {
        this.carGroup.get('model')!.setValue(this.carSearched!.model);
        this.carGroup.get('year')!.setValue(this.carSearched!.year);
        this.carGroup.get('color')!.setValue(this.carSearched!.color);
    }

    private enableCarControls(): void {
        this.carGroup.get('model')!.enable();
        this.carGroup.get('year')!.enable();
        this.carGroup.get('color')!.enable();
    }

    public selectEstablishment(establishment: Establishment): void {
        this.establishmentSelected = establishment;
        this.establishmentGroup.get('id')!
          .setValue(establishment.id);
        this.standRows = JSON.parse(establishment.standRowsJson);
        this.standColumns = JSON.parse(establishment.standColumnsJson);

        this.standService.getAllOccupiedStands(establishment.id)
            .subscribe(res => this.occupiedStandCodes = res);
    }

    public verifyStandOccupied(standCode: string): boolean {
        return this.occupiedStandCodes.includes(standCode);
    }

    public selectStand(row: number, column: string): void {
        const standCode = column + row;
        const occupied = this.verifyStandOccupied(standCode);
        if (occupied) return;
        this.standGroup.get('code')!.setValue(standCode);
    }

    public finalize(): void {
        const createMovement: ICreateMovementRequest = {
            carId: this.carSearched!.id,
            establishmentId: this.establishmentGroup.get('id')!.value,
            enterDate: moment().format("YYYY-MM-DD HH:mm:ss"),
            standCode: this.standGroup.get('code')!.value
        };
        this.movementService.create(createMovement)
            .subscribe({
                next: _ => {
                    this.navCtrl.navigateRoot(['movement'])
                        .then(_ => this.commonService.showToast("Se creo el movimiento con éxito"));
                },
                error: _ => {
                    this.commonService.showToast("Hubo un error al crear el movimiento");
                }
            });
    }
}