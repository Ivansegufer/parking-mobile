import { Component } from '@angular/core';
import { Movement } from '../../../models/movement.model';
import { ModalController, NavController, ViewWillEnter } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { MovementService } from '../../../services/movement.service';
import { User } from '../../../models/user.model';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { CloseMovementComponent } from './modals/close-movement.component';

@Component({
  selector: 'app-movement',
  templateUrl: 'movement.page.html',
  styleUrls: ['movement.page.scss']
})
export class MovementPage implements ViewWillEnter {

  public movements: Movement[] = [];
  public originalMovements: Movement[] = [];

  private searchSubject: Subject<string> = new Subject<string>();
  private userLogged: User | null = null;

  public constructor(
    private readonly navCtrl: NavController,
    private readonly modalController: ModalController,
    private readonly authService: AuthService,
    private readonly movementService: MovementService
  ) {
    this.searchSubject.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ).subscribe((searchTerm: string) => {
      this.filterMovement(searchTerm);
    });
  }

  private filterMovement(searchTerm: string) {
    const filter = searchTerm.trim().toLowerCase();

    if (searchTerm || searchTerm === '') {
      this.movements = this.originalMovements;
    }

    this.movements = this.originalMovements
      .filter(movement => {
        const combinedFields = `${movement.plateNumber.toLowerCase()} ` +
          `${movement.model.toLowerCase()} ` +
          `${movement.year.toString().toLowerCase()} ` +
          `${movement.color.toLowerCase()} ` +
          `${movement.establishmentName.toLowerCase()}`;

          return combinedFields.includes(filter);
      });
  }

  public async handleCloseMovement(movement: Movement): Promise<void> {
    const modal = await this.modalController.create({
      component: CloseMovementComponent,
      cssClass: 'inline_modal',
      breakpoints: [0.1, 0.9, 1],
      initialBreakpoint: 0.9,
      componentProps: {
        movement
      }
    });

    await modal.present();
    await modal.onWillDismiss();

    this.movementService.getAllActivesByUserId(this.userLogged!.id)
      .subscribe(res => {
        this.movements = res
        this.originalMovements = this.movements;
      });
  }

  public ionViewWillEnter(): void {
    this.authService.getSession('user')
      .then(userJson => {
        const user = JSON.parse(userJson!) as User;
        this.userLogged = user;
        this.movementService.getAllActivesByUserId(user.id)
          .subscribe(res => {
            this.movements = res
            this.originalMovements = this.movements;
          });
      });
  }

  public onSearchInput(event: any): void {
    const searchTerm = event.target.value;
    this.searchSubject.next(searchTerm);
  }

  public addMovement(): void {
    this.navCtrl.navigateRoot('/movement/create');
  }
}
