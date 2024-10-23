import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Entrada } from 'src/app/entities/entrada';
import { Plantilla_Entrada } from 'src/app/entities/plantilla_entrada';
import { Usuario } from 'src/app/entities/usuario';

@Component({
  selector: 'app-plantilla-selec',
  templateUrl: './plantilla-selec.component.html',
  styleUrls: ['./plantilla-selec.component.scss'],
})
export class PlantillaSelecComponent  {

  @Input() plantilla_selecionada : Plantilla_Entrada = new Plantilla_Entrada
  @Input() usuario : Usuario = new Usuario
  @Output() Deseleccionar_Plantilla = new EventEmitter<void>();
  @Output() SubirNuevaEntrada = new EventEmitter<Entrada>();
  @Output() EliminarPlantilla = new EventEmitter<Plantilla_Entrada>();
  
  nombre_cliente = "";
  apellido_cliente = "";
  dni_cliente: any;

  constructor(private toastController : ToastController) { }

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

  VenderEntrada(){
    if(!this.plantilla_selecionada.en_puerta) {
      
      if(this.nombre_cliente.length >= 2 && this.nombre_cliente.length <= 50) {
        if(this.apellido_cliente.length >= 2 && this.apellido_cliente.length <= 50) {
          if(this.dni_cliente.toString().length >= 7 &&  this.dni_cliente.toString().length <= 8) {

            this.CrearSubirEntrada()

            } else {
              this.presentToast("top","Complete los datos requeridos","danger")
            }
          } else {
            this.presentToast("top","Complete los datos requeridos","danger")
          }
      } else {
        this.presentToast("top","Complete los datos requeridos","danger")
      }

    } else {
      
      this.CrearSubirEntrada()
    }
  }

  getCurrentDate() {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    // Obtener la fecha actual en Argentina (UTC-3)
    const currentDate = new Date().toLocaleDateString('es-AR', options);
    console.log(currentDate); // Muestra la fecha en la consola
    return currentDate
  }

  CrearSubirEntrada(){
    let entrada = new Entrada()
    entrada.uid_evento = this.plantilla_selecionada.uid_evento
    entrada.uid_plantilla = this.plantilla_selecionada.uid
    entrada.nombre_cliente = this.nombre_cliente
    entrada.apellido_cliente = this.apellido_cliente
    entrada.dni = this.dni_cliente
    entrada.tipo_plantilla = this.plantilla_selecionada.nombre_entrada
    entrada.vip = this.plantilla_selecionada.vip
    entrada.en_puerta = this.plantilla_selecionada.en_puerta
    entrada.valor = this.plantilla_selecionada.valor
    entrada.cantidad_entradas = this.plantilla_selecionada.cantidad_entradas
    entrada.fecha_venta = this.getCurrentDate()
    // Agrega la entrada y suma +1 en entradas vendidas de la plantilla seleccionada
    this.SubirNuevaEntrada.emit(entrada)
    this.BorrarCampos()
  }

  BorrarCampos(){
    this.dni_cliente = undefined
    this.nombre_cliente = ""
    this.apellido_cliente = ""
  }

  DeselctPlantillaEntrada(){
    this.BorrarCampos()
    this.Deseleccionar_Plantilla.emit()
  }

  public alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      cssClass: 'alert-button-cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'Eliminar',
      role: 'confirm',
      cssClass: 'alert-button-confirm',
      handler: () => {
        console.log('Alert confirmed');
        this.Eliminar()
      },
    },
  ];

  setResult(ev:any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }

  Eliminar(){
    this.EliminarPlantilla.emit(this.plantilla_selecionada)
    this.DeselctPlantillaEntrada()
  }
  

}
