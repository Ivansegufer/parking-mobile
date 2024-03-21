import { Component, OnDestroy, OnInit } from "@angular/core";
import { IonicModule, ModalController, NavParams } from "@ionic/angular";
import { Movement } from "../../../../models/movement.model";
import { CommonModule } from "@angular/common";
import * as moment from "moment";
import { ICloseMovementRequest } from "../interfaces/requests/close-car.request";
import { MovementService } from "../../../../services/movement.service";
import { CommonService } from "../../../../services/common.service";

@Component({
    selector: 'app-close-movement',
    templateUrl: './close-movement.component.html',
    styleUrls: ['./close-movement.component.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule]
})
export class CloseMovementComponent implements OnInit, OnDestroy {

    public movement!: Movement;
    public currentDateTime: Date = new Date();
    public amount: number = 0;

    private intervalId: number | null = null;

    public constructor(
        private readonly navParams: NavParams,
        private readonly modalController: ModalController,
        private readonly commonService: CommonService,
        private readonly movementService: MovementService
    ) { }

    public ngOnInit(): void {
        this.movement = this.navParams.get('movement');
        this.calculateAmount();

        this.intervalId = window.setInterval(() => {
            this.currentDateTime = new Date();
            this.calculateAmount();
        }, 1000);
    }

    public ngOnDestroy(): void {
        window.clearInterval(this.intervalId!);
    }

    public close(): void {
        this.calculateAmount();

        const closeMovementRequest: ICloseMovementRequest = {
            id: this.movement.movementId,
            establishmentId: this.movement.establishmentId,
            amount: this.amount,
            exitDate: moment().format("YYYY-MM-DD HH:mm:ss")
        };

        this.movementService.update(closeMovementRequest)
            .subscribe({
                next: _ => {
                    this.commonService.showToast("Movimiento cerrado con éxito");
                    this.modalController.dismiss();
                },
                error: _ => {
                    this.commonService.showToast("Hubo un error al cerrar el movimiento");
                }
            });
    }

    private calculateAmount(): void {
        const diffMinutes = moment().diff(moment(this.movement.enterDate), 'minutes');
        this.amount = diffMinutes * this.movement.fare;
    }
}