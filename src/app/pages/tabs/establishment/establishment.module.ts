import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstablishmentPage } from './establishment.page';

import { EstablishmentRoutingModule } from './establishment-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    EstablishmentRoutingModule
  ],
  declarations: [EstablishmentPage]
})
export class EstablishmentPageModule {}
