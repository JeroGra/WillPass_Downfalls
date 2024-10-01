import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MenuController, NavController, PickerController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/entities/usuario';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-agregar-usuario',
  templateUrl: './agregar-usuario.page.html',
  styleUrls: ['./agregar-usuario.page.scss'],
})
export class AgregarUsuarioPage  {

  usuario = new Usuario
  nuevo_usuario = new Usuario
  u_nombre = ""
  u_clave = ""
  // cambia a text para poder ver la clave
  tipo_clave = "password"
  permiso = "Sin Permiso Asignado"

  constructor(private toastController:ToastController, private db : DataBaseService, private ruta : NavController, private menuCtrl: MenuController, private pickerCtrl : PickerController) {
    this.usuario = db.ObtenerMiUsuarioLocalstorage()
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

   //Para Organizador
   async openPickerOrganizador(){
    const picker = await this.pickerCtrl.create({
      columns: [
        {
          name: 'rol',
          options: [
            {
              text: 'Asistente',
              value: 'Asistente',
            },
            {
              text: 'Editor',
              value: 'Editor',
            },
            {
              text: 'Admin',
              value: 'Admin',
            },
          ],
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: (value) => {
            console.log(`You selected: ${value.rol.value}`);
            this.SetPermisos(value.rol.value)
          },
        },
      ],
    });

    await picker.present();
   }

   //Para admins
   async openPickerAdmin(){
    const picker = await this.pickerCtrl.create({
      columns: [
        {
          name: 'rol',
          options: [
            {
              text: 'Asistente',
              value: 'Asistente',
            },
            {
              text: 'Editor',
              value: 'Editor',
            },
          ],
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: (value) => {
            console.log(`You selected: ${value.rol.value}`);
            this.SetPermisos(value.rol.value)
          },
        },
      ],
    });

    await picker.present();
   }

   SetPermisos(permiso : 'Admin' | "Editor" | "Asistente"){
    this.permiso = permiso
    this.nuevo_usuario.tipo = permiso
    switch(permiso){
      case 'Admin':
        this.nuevo_usuario.admin = true
        this.nuevo_usuario.editor = true
        this.nuevo_usuario.organizador = false
        break;
      case 'Editor':
        this.nuevo_usuario.admin = false
        this.nuevo_usuario.editor = true
        this.nuevo_usuario.organizador = false
        break;
      case 'Asistente':
        this.nuevo_usuario.admin = false
        this.nuevo_usuario.editor = false
        this.nuevo_usuario.organizador = false
        break;
    }
  }

  Agregar(){
    if(this.u_nombre != "" && this.u_clave != "" && this.permiso != "Sin Permiso Asignado"){
      if(this.u_nombre.length >= 6 && this.u_nombre.length <= 30){
        if(this.u_clave.length >= 6 && this.u_clave.length <= 30){

          this.nuevo_usuario.nombre = this.u_nombre
          this.nuevo_usuario.clave = this.u_clave
          this.nuevo_usuario.uid_organizador = this.usuario.uid_organizador
          let ok = this.db.AgregarUsuario(this.nuevo_usuario)
          if(ok){ this.presentToast("top","Usuario Agregado!","success") } else { this.presentToast("top","No se pudo Agregar. Error Con la Conexion","danger") }
          this.Clear()
        } else {
          this.presentToast("top","Coloque una clave entre 6 a 30 caracteres","danger")
        }
      } else {
        this.presentToast("top","Coloque un nombre entre 6 a 30 caracteres","danger")
      }
    } else {
      this.presentToast("top","Faltan completar datos","danger")
    }
  }

  Ver(){
    if(this.tipo_clave == "password"){
      this.tipo_clave = "text"
    }else{
      this.tipo_clave = "password"
    }
  }

  Clear(){
    this.nuevo_usuario = new Usuario
    this.u_clave = ""
    this.u_nombre = ""
    this.permiso = "Sin Permiso Asignado"
  }

  Volver(){
    this.ruta.navigateRoot(['home'])
  }

}
