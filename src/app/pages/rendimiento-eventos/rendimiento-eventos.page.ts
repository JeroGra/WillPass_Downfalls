import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Informacion_Evento } from 'src/app/entities/informacion_evento';
import { Sesion } from 'src/app/entities/sesion';
import { Usuario } from 'src/app/entities/usuario';
import { DataBaseService } from 'src/app/services/data-base.service';


@Component({
  selector: 'app-rendimiento-eventos',
  templateUrl: './rendimiento-eventos.page.html',
  styleUrls: ['./rendimiento-eventos.page.scss'],
})

export class RendimientoEventosPage  {

  info_eventos : Array<Informacion_Evento> = []
  mi_sesion : Sesion = new Sesion
  user : Usuario = new  Usuario
  cargando = true

  arr_ventas : Array<Informacion_Evento> = []
  arr_generado : Array<Informacion_Evento> = []
  arr_asistencias : Array<Informacion_Evento> = []

  constructor(private toastController:ToastController, private db : DataBaseService, private ruta : NavController) {
      this.user = this.db.ObtenerMiUsuarioLocalstorage()
      this.db.ObtenerInformacionEventosObservable(this.user.uid_organizador).subscribe((inf : any) => {
        this.info_eventos = inf as Array<Informacion_Evento>

        this.arr_ventas = []
        this.arr_generado = []
        this.arr_asistencias = []

        this.info_eventos.forEach((inf : Informacion_Evento) => {
          this.arr_ventas.push(inf)
          this.arr_generado.push(inf)
          this.arr_asistencias.push(inf)
        });

        this.arr_ventas.sort((a, b) => {
          // Convertir las fechas a objetos Date para compararlas
          const a_entradas = a.entradas_vendidas
          const b_entradas = b.entradas_vendidas;
        
          return a_entradas - b_entradas; // Ordena en orden ascendente (más antiguo a más reciente)
        });

        this.arr_generado.sort((a, b) => {
          // Convertir las fechas a objetos Date para compararlas
          const a_entradas = a.total_recaudado
          const b_entradas = b.total_recaudado;
        
          return a_entradas - b_entradas; // Ordena en orden ascendente (más antiguo a más reciente)
        });

        this.arr_asistencias.sort((a, b) => {
          // Convertir las fechas a objetos Date para compararlas
          const a_entradas = a.asistencias
          const b_entradas = b.asistencias;
        
          return a_entradas - b_entradas; // Ordena en orden ascendente (más antiguo a más reciente)
        });


        let rt = db.ObtenerUltimaSesion()
        if(rt != null){
          this.mi_sesion = rt as Sesion
        }

        this.cargando = false

      })
  }

  async presentToast(position:"top" | "middle", message = "", color = "danger"){
   const toast = await this.toastController.create({
     message: message,
     duration: 2000,
     position: position,
     color : color,
     cssClass:"my-toast"
   });

   await toast.present();
 }

  Volver(){
    this.mi_sesion.seccion = ""
    this.db.RecordarUltimaSesion(this.mi_sesion)
    this.ruta.navigateRoot(["home"])
  }

}
