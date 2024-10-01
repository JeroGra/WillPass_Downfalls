import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarUsuarioPageRoutingModule } from './agregar-usuario-routing.module';

import { AgregarUsuarioPage } from './agregar-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarUsuarioPageRoutingModule
  ],
  declarations: [AgregarUsuarioPage]
})
export class AgregarUsuarioPageModule {}
