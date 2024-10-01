import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/entities/usuario';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage  {

  usuario = new Usuario
  user_visible = new Usuario
  editando = false
  u_nombre = ""
  u_clave = ""
  u_clave_nueva = ""

  constructor(private toastController:ToastController, private db : DataBaseService, private ruta : NavController) {
     this.user_visible = this.db.ObtenerMiUsuarioLocalstorage()
     this.db.TraerUsuariosPorNombre(this.user_visible.nombre).then((user : Usuario) =>{
      this.usuario = user
      this.u_nombre = user.nombre
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

  Editar(){
    if(!this.editando){
      this.editando = true
      this.u_nombre = this.user_visible.nombre 
    } else {
      this.editando = false
      this.u_clave = ""
      this.u_clave_nueva = ""
      this.u_nombre = ""
    }
  }

  Modificar(){
    if(this.u_clave_nueva == ""){
      if(this.u_nombre.length >= 6 && this.u_nombre.length <= 30){
        if(this.u_nombre != this.usuario.nombre){
          if(this.u_clave == this.usuario.clave){
            let new_usr = this.usuario
            new_usr.nombre = this.u_nombre

            let ok = this.db.ModificarUsuario(new_usr)
            if(ok){ this.presentToast("top","Usuario Modificado","success") } else { this.presentToast("top","No se pudo Crear. Error Con la Conexion","danger") }
            this.db.GuardarUsuarioLocalstorage(new_usr)
            this.usuario = new_usr
            this.user_visible = new_usr
            this.Editar()
            this.db.TraerUsuariosPorNombre(this.user_visible.nombre).then((user : Usuario) =>{
              this.usuario = user
              this.u_nombre = user.nombre
            })
            
          }else{
            this.presentToast("top","Clave actual invalida. No se pueden efectuar los cambios","danger")
          }
        } else {
          this.presentToast("top","El nombre es el mismo al actual","warning")
        }
      } else {
        this.presentToast("top","Coloque un nombre entre 6 a 30 caracteres","danger")
      }
    } else {
      if(this.u_nombre.length >= 6 && this.u_nombre.length <= 30){
        if(this.u_clave_nueva.length  >= 6 && this.u_clave_nueva.length <= 30){
          if(this.u_clave == this.usuario.clave){
            let new_usr = this.usuario
            new_usr.nombre = this.u_nombre
            new_usr.clave = this.u_clave_nueva

            let ok = this.db.ModificarUsuario(new_usr)
            if(ok){ this.presentToast("top","Usuario Modificado","success") } else { this.presentToast("top","No se pudo Crear. Error Con la Conexion","danger") }
            this.db.GuardarUsuarioLocalstorage(new_usr)
            this.usuario = new_usr
            this.user_visible = new_usr
            this.Editar()
            this.db.TraerUsuariosPorNombre(this.user_visible.nombre).then((user : Usuario) =>{
              this.usuario = user
              this.u_nombre = user.nombre
            })

          }else{
            this.presentToast("top","Clave actual invalida. No se pueden efectuar los cambios","danger")
          }
        } else {
          this.presentToast("top","Coloque una clave nueva entre 6 a 30 caracteres","danger")
        }
      } else {
        this.presentToast("top","Coloque un nombre entre 6 a 30 caracteres","danger")
      }
    }
  }

  Volver(){
    this.ruta.navigateRoot(["home"])
  }

}
