import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstablishmentPage } from './establishment.page';
import { CreateEstablishmentPage } from './create-establishment/create-establishment.page';

const routes: Routes = [
  {
    path: '',
    component: EstablishmentPage
  },
  {
    path: 'create',
    component: CreateEstablishmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstablishmentRoutingModule {}
