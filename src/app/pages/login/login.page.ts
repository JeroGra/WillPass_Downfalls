import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/entities/usuario';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  nombre = ""
  clave = ""
  loading = false
  ocultar_footer = false
  
  constructor(private toastController:ToastController, private db : DataBaseService, private ruta : NavController) { }

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

  Login(){
    
    if(this.nombre != "" && this.clave != ""){
      this.loading = true
      this.db.TraerUsuariosPorNombre(this.nombre).then((usuario : Usuario) => {
        if(usuario.clave === this.clave){
          this.db.GuardarUsuarioLocalstorage(usuario)
          this.loading = false
          this.presentToast("top","Bienvenido/a "+usuario.nombre,"success")
          
          this.BorrarCampos()
          this.ruta.navigateRoot(["home"])
        } else {
          this.loading = false
          this.presentToast("top","Clave Invalida","danger")
        }
      }).catch((error) => {
        this.presentToast("top","Error, No existe Usuario","danger")
        this.loading = false
        let arr = this.nombre.split("")
        arr.forEach(char => {
          if(char == " "){
            this.presentToast("top","Cuidado. El nombre contiene espacios","warning")
          }
          
        })
      })
    
    } else {
      this.presentToast("top","Complete todos los campos","danger")
    }

  }

  BorrarCampos(){
    this.nombre = ""
    this.clave = ""
  }

}
