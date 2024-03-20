import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'establishment',
        loadChildren: () => import('./establishment/establishment.module').then(m => m.EstablishmentPageModule)
      },
      {
        path: 'movement',
        loadChildren: () => import('./movement/movement.module').then(m => m.MovementPageModule)
      },
      {
        path: '',
        redirectTo: '/profile',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
