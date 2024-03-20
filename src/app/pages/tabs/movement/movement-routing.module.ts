import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovementPage } from './movement.page';
import { CreateMovementPage } from './create-movement/create-movement.page';

const routes: Routes = [
  {
    path: '',
    component: MovementPage,
  },
  {
    path: 'create',
    component: CreateMovementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovementPageRoutingModule {}
