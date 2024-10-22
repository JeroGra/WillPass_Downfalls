import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RendimientoEventosPageRoutingModule } from './rendimiento-eventos-routing.module';

import { RendimientoEventosPage } from './rendimiento-eventos.page';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RendimientoEventosPageRoutingModule,
    NgApexchartsModule
  ],
  declarations: [RendimientoEventosPage]
})
export class RendimientoEventosPageModule {}
