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
  arr_crecimiento : Array<Informacion_Evento> = []
  crecimiento : any[] = []
  total_vendido = 0
  total_asistencias = 0
  total_generado = 0

  constructor(private toastController:ToastController, private db : DataBaseService, private ruta : NavController) {
      this.user = this.db.ObtenerMiUsuarioLocalstorage()
      this.db.ObtenerInformacionEventosObservable(this.user.uid_organizador).subscribe((inf : any) => {
        this.info_eventos = inf as Array<Informacion_Evento>

        this.arr_ventas = []
        this.arr_generado = []
        this.arr_asistencias = []
        this.arr_crecimiento = []
        this.crecimiento = []
        this.total_vendido = 0
        this.total_asistencias = 0
        this.total_generado = 0

        this.info_eventos.forEach((inf : Informacion_Evento) => {
          this.arr_ventas.push(inf)
          this.arr_generado.push(inf)
          this.arr_asistencias.push(inf)
          this.arr_crecimiento.push(inf)
          this.total_vendido += inf.entradas_vendidas
          this.total_asistencias += inf.asistencias
          this.total_generado += inf.total_recaudado
        });

        this.arr_ventas.sort((a, b) => {
     
          const a_ventas = a.entradas_vendidas
          const b_ventas = b.entradas_vendidas;
        
          return a_ventas + b_ventas; 
        });

        this.arr_generado.sort((a, b) => {
       
          const a_generado = a.total_recaudado
          const b_generado = b.total_recaudado;
        
          return a_generado + b_generado; 
        });

        this.arr_asistencias.sort((a, b) => {
   
          const a_asistencias = a.asistencias
          const b_asistencias = b.asistencias;
        
          return a_asistencias + b_asistencias; 
        });

        this.arr_crecimiento.sort((a, b) => {
          // Convertir las fechas a objetos Date para compararlas
          const a_fecha = new Date(a.fecha).getTime()
          const b_fecha = new Date(b.fecha).getTime()
        
          return a_fecha - b_fecha; // Ordena en orden ascendente (más antiguo a más reciente)
        });
        
        this.CalcularVentas()

        let rt = db.ObtenerUltimaSesion()
        if(rt != null){
          this.mi_sesion = rt as Sesion
        }

        this.cargando = false

      })
  }

  CalcularVentas(){
    this.arr_crecimiento.forEach((objeto, index) => {
      let objCrecimiento = {
        crecimiento: "---",
        nombre_evento:""
      }

      objCrecimiento.nombre_evento = objeto.nombre_evento

      if (index > 0) { // No calculamos crecimiento para el primer elemento, ya que no tiene anterior
        const ventasAnterior =  this.arr_crecimiento[index - 1].entradas_vendidas;
        const ventasActual = objeto.entradas_vendidas;
        const crecimiento = this.CalcularCrecimiento(ventasAnterior, ventasActual);
        
        objCrecimiento.crecimiento = crecimiento.toFixed(2)
      }

      this.crecimiento.push(objCrecimiento)

    });
  }



  CalcularCrecimiento(ventasAnterior: number, ventasActual: number): number {
    if (ventasAnterior === 0) {
      return 100; // Si las ventas anteriores son 0, consideramos un crecimiento del 100%.
    }
    return ((ventasActual - ventasAnterior) / ventasAnterior) * 100;
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
