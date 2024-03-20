import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovementPage } from './movement.page';

import { MovementPageRoutingModule } from './movement-routing.module';
import { CloseMovementComponent } from './modals/close-movement.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MovementPageRoutingModule,
    CloseMovementComponent
  ],
  declarations: [MovementPage]
})
export class MovementPageModule {}
