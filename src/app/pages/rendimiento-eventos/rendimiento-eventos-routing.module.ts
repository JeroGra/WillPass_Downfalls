import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RendimientoEventosPage } from './rendimiento-eventos.page';

const routes: Routes = [
  {
    path: '',
    component: RendimientoEventosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RendimientoEventosPageRoutingModule {}
