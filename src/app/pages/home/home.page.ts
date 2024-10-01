import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Evento } from 'src/app/entities/evento';
import { Usuario } from 'src/app/entities/usuario';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnDestroy {

  eventos : Array<Evento> = []
  Subcriber : Subscription = new Subscription
  creando_evento = false
  usuario : Usuario = new Usuario
  modificando_evento = false
  evento_select = new Evento

  fecha_evento : any
  hora_evento : any
  nombre_evento : any = ""

  error_nombre = ""
  error_fecha = ""
  errror_hora = ""

  loading = false

  constructor(private toastController:ToastController, private db : DataBaseService, private ruta : NavController, private menuCtrl: MenuController) {
    this.loading = true
    this.usuario = this.db.ObtenerMiUsuarioLocalstorage()
    this.Subcriber = this.db.ObtenerEventosObservableUidUsuario(this.usuario.uid_organizador).subscribe((eventos : any) => {
      this.eventos = eventos as Evento[]
      this.loading = false
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

  timeUntilFutureDate(fecha: string): string {
    // Convertir la fecha ingresada en un objeto Date
    const futureDate = new Date(fecha);

    // Obtener la fecha y hora actuales
    const now = new Date();

    // Calcular la diferencia en milisegundos
    const difference = futureDate.getTime() - now.getTime();

    if (difference <= 0) {
        return "La fecha ya ha pasado o es la actual.";
    }

    // Calcular días, horas, minutos y segundos
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));


    return `Faltan ${days } días.`;
}

  CrearEvento(){
    this.creando_evento = true
  }

  AgregarEvento(){

    if(this.ValidarCadena(this.nombre_evento)){
      this.error_nombre = ""
    } else {
      this.error_nombre = "Coloque entre 5 a 30 caracteres"
    }

    if(this.fecha_evento != undefined) {
      if(this.ValidarFecha(this.fecha_evento as string)) {
       this.error_fecha = ""
      } else {
        this.error_fecha = "La fecha ya pasó"
       this.presentToast("top",this.error_fecha,"danger")
      }
    } else {
      this.error_fecha = "Coloque una fecha"
    }

    if(this.hora_evento != undefined) {
      this.errror_hora = ""
    } else {
      this.errror_hora = "Coloque una hora"
    }

    if(this.error_fecha == "" && this.error_nombre == "" && this.errror_hora == ""){
      let nuevo_evento = new Evento
      nuevo_evento.nombre = this.nombre_evento
      nuevo_evento.fecha = this.fecha_evento
      nuevo_evento.hora = this.hora_evento
      nuevo_evento.uid_organizador = this.usuario.uid_organizador
      // Lo sube a la bd
      let ok = this.db.AgregarEvento(nuevo_evento)
      if(ok){ this.presentToast("top","Evento Creado!","success") } else { this.presentToast("top","No se pudo Crear. Error Con la Conexion","danger") }
      this.Volver()
    }

  }

  ValidarCadena(cadena : any) : boolean {
    return (cadena.length >= 5 && cadena.length <= 30)
  }

  ValidarFecha(fecha : any) : boolean {
    const date = new Date(fecha + "T00:00:00-03:00"); // UTC-3 es la zona horaria de Argentina

    // Obtener la fecha actual en la zona horaria de Argentina sin horas (solo año, mes, día)
    const today = new Date();
    today.setUTCHours(today.getUTCHours() - 3); // Ajustar la hora UTC a Argentina
    today.setHours(0, 0, 0, 0);

    // Comparar las fechas
    return date >= today;
  }

  Volver(){
    this.creando_evento = false
    this.nombre_evento = ""
    this.fecha_evento = undefined
    this.hora_evento = undefined
    this.modificando_evento = false
    this.evento_select = new Evento
  }

  Login(){
    this.eventos = []
    this.usuario = new Usuario
    this.db.BorrarUsuarioLocalstorage()
    this.ruta.navigateRoot(['login'])
  }

  SelecEvento(evento : Evento){
    console.log(evento)
    this.db.GuardarEventoSeleccionadoLocalstorage(evento)
    this.ruta.navigateRoot(['evento'])
  }

  ModificarEventoSelect(evento : Evento){
    this.modificando_evento = true
    this.evento_select = evento
    this.nombre_evento = evento.nombre
    this.fecha_evento = evento.fecha
    this.hora_evento = evento.hora
  }

  ModificarEvento(){

    if(this.ValidarCadena(this.nombre_evento)){
      this.error_nombre = ""
    } else {
      this.error_nombre = "Coloque entre 5 a 30 caracteres"
    }

    if(this.fecha_evento != undefined) {
      if(this.ValidarFecha(this.fecha_evento as string)) {
       this.error_fecha = ""
      } else {
        this.error_fecha = "La fecha ya pasó"
       this.presentToast("top",this.error_fecha,"danger")
      }
    } else {
      this.error_fecha = "Coloque una fecha"
    }

    if(this.hora_evento != undefined) {
      this.errror_hora = ""
    } else {
      this.errror_hora = "Coloque una hora"
    }

    if(this.error_fecha == "" && this.error_nombre == "" && this.errror_hora == ""){
      if(this.fecha_evento != this.evento_select.fecha || this.nombre_evento != this.evento_select.nombre || this.hora_evento != this.evento_select.hora){
        this.evento_select.nombre = this.nombre_evento
        this.evento_select.fecha = this.fecha_evento
        this.evento_select.hora = this.hora_evento
        // Lo sube a la bd
        let ok = this.db.ModificarEvento(this.evento_select)
        if(ok){ this.presentToast("top","Evento Modificado","success") } else { this.presentToast("top","No se pudo Crear. Error Con la Conexion","danger") }
        this.Volver()
      } else {
        this.presentToast("top","No hay ningun dato cambiado","warning")
      }
    }
  }

  AbrirMenu(){
    this.menuCtrl.open('menu-usuario');
  }

  Perfil(){
    this.ruta.navigateRoot(['perfil'])
  }

  AgregarUsuarios(){
    this.ruta.navigateRoot(['agregar-usuario'])
  }

  Usuarios(){
    this.ruta.navigateRoot(['usuarios'])
  }

  RendimietnoEventos(){
    this.ruta.navigateRoot(['rendimiento-eventos'])
  }

  ngOnDestroy() {
    this.Subcriber.unsubscribe()
  }

}
