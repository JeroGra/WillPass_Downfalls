import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarUsuarioPage } from './agregar-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarUsuarioPageRoutingModule {}
