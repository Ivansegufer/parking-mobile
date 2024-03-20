import { Component, OnInit } from '@angular/core';
import { NavController, ViewWillEnter } from '@ionic/angular';
import { Establishment } from '../../../models/establishment.model';
import { EstablishmentService } from '../../../services/establishment.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-establishment',
  templateUrl: 'establishment.page.html',
  styleUrls: ['establishment.page.scss']
})
export class EstablishmentPage implements ViewWillEnter {

  public establishments: Establishment[] = [];

  public constructor(
    private readonly navCtrl: NavController,
    private readonly authService: AuthService,
    private readonly establishmentService: EstablishmentService
  ) { }
  
  public ionViewWillEnter(): void {
    this.authService.getSession('user')
      .then(userJson => {
        const user = JSON.parse(userJson!) as User;
        this.establishmentService.getAllByUserId(user.id)
          .subscribe(res => this.establishments = res);
      });
  }

  public addEstablishment(): void {
    this.navCtrl.navigateRoot('/establishment/create');
  }
}
