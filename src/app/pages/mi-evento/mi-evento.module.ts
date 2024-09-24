import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiEventoPageRoutingModule } from './mi-evento-routing.module';

import { MiEventoPage } from './mi-evento.page';
import { PlantillaSelecComponent } from './components/plantilla-selec/plantilla-selec.component';
import { ListaEntradasComponent } from './components/lista-entradas/lista-entradas.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiEventoPageRoutingModule,
    NgApexchartsModule
  ],
  declarations: [MiEventoPage,PlantillaSelecComponent,ListaEntradasComponent]
})
export class MiEventoPageModule {}
