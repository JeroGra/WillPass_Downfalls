import { Component, OnDestroy } from '@angular/core';
import { MenuController, NavController, PickerController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Sesion } from 'src/app/entities/sesion';
import { Usuario } from 'src/app/entities/usuario';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnDestroy {

  usuario = new Usuario
  usuarios : Usuario[] = []
  Subcriber : Subscription = new Subscription
  loading = false
  edicion_usuario = false
  usuario_select = new Usuario
  permiso = ""
  mi_sesion : Sesion = new Sesion
  
  constructor(private toastController:ToastController, private db : DataBaseService, private ruta : NavController, private menuCtrl: MenuController,
     private pickerCtrl : PickerController) {
      this.loading = true
      this.usuario = db.ObtenerMiUsuarioLocalstorage()
      this.Subcriber = this.db.TraerUsuariosAsociados(this.usuario.uid_organizador).subscribe((users : any) => {
        this.usuarios = users as Array<Usuario>
        let arrUsr : Array<Usuario> = []
        for(let i = 0; i<this.usuarios.length; i++){
          if(this.usuarios[i].uid != this.usuario.uid_organizador && this.usuarios[i].uid != this.usuario.uid){
            if(this.usuarios[i].admin){
              if(this.usuario.organizador){
                arrUsr.push(this.usuarios[i])
              }
            } else {
              arrUsr.push(this.usuarios[i])
            }
          }
        }
        this.usuarios = arrUsr
        let rt = db.ObtenerUltimaSesion()
        if(rt != null){
          this.mi_sesion = rt as Sesion
        }
        this.loading = false
      })
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
      this.usuario_select.tipo = permiso
      switch(permiso){
        case 'Admin':
          this.usuario_select.admin = true
          this.usuario_select.editor = true
          this.usuario_select.organizador = false
          break;
        case 'Editor':
          this.usuario_select.admin = false
          this.usuario_select.editor = true
          this.usuario_select.organizador = false
          break;
        case 'Asistente':
          this.usuario_select.admin = false
          this.usuario_select.editor = false
          this.usuario_select.organizador = false
          break;
      }
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
        let ok = this.db.EliminarUsuario(this.usuario_select.uid)
        if(ok){ this.presentToast("top","Se elimino correctamente","success") }else{ this.presentToast("top","Error con la conexion","danger") } 
      },
    },
  ];

  setResult(ev:any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
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

  UserSelectEliminar(user : Usuario)
  {
    this.usuario_select = user
  }

  UserSelectEditar(user : Usuario)
  {
    this.edicion_usuario = true
    this.usuario_select = user
    this.permiso = user.tipo
  }

  Modificar(){
    let ok = this.db.ModificarUsuario(this.usuario_select)
    if(ok){ this.presentToast("top","Usuario Modificado","success") } else { this.presentToast("top","No se pudo Modificar. Error Con la Conexion","danger") }
    this.Deselect()
  }

  Deselect(){
    this.edicion_usuario = false
    this.usuario_select = new Usuario
    this.permiso = ""
  }

  Volver(){
    this.mi_sesion.seccion = ""
    this.db.RecordarUltimaSesion(this.mi_sesion)
    this.ruta.navigateRoot(['home'])
  }

  ngOnDestroy() {
    this.Subcriber.unsubscribe()
  }
}
