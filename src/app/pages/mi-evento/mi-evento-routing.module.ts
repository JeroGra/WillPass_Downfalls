import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiEventoPage } from './mi-evento.page';

const routes: Routes = [
  {
    path: '',
    component: MiEventoPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiEventoPageRoutingModule {}
