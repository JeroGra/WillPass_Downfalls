import { Injectable } from '@angular/core';
import { Evento } from '../entities/evento';
import { Entrada } from '../entities/entrada';
import { Plantilla_Entrada } from '../entities/plantilla_entrada';
import { Firestore, documentId, updateDoc, } from '@angular/fire/firestore';
import { getDocs,setDoc,doc,addDoc,collection,deleteDoc,query,where,orderBy } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { Usuario } from '../entities/usuario';

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {

  constructor(private firestore : Firestore) { }
  
  //#region Almacenamiento Por localStorage (SOLO PARA PRUEBAS)

  // GuardarEvento(eventos : Array<Evento>){
  //   localStorage.setItem("eventos", JSON.stringify(eventos))
  // }

  // ObtenerEventos() : Array<Evento> {
  //   let eventos : Array<Evento> = []
  //   try {
  //     let rt = JSON.parse(localStorage.getItem("eventos") as string)
  //     if(rt == null) {
  //       throw new Error("No hay Eventos")
  //     }
    
  //     rt.forEach((evn : Evento) => {
  //       eventos.push(evn)
  //     });

  //   } catch (error) {
  //     console.log(error, "No hay eventos")
  //   }
  //   return eventos
  // }

  // GuardarPlantillasEntradas(entradas : Array<Plantilla_Entrada>, uid_evento : string){
  //   localStorage.removeItem(`${uid_evento}_entradas`)
  //   localStorage.setItem(`${uid_evento}_entradas`, JSON.stringify(entradas))
  // }

  // ObtenerPlantillasEntradas(uid_evento : string) : Array<Plantilla_Entrada> {
  //   let entradas : Array<Plantilla_Entrada> = []
  //   try {
  //     let rt = JSON.parse(localStorage.getItem(`${uid_evento}_entradas`) as string)
  //     if(rt == null) {
  //       throw new Error("No hay Entradas")
  //     }
    
  //     rt.forEach((evn : Plantilla_Entrada) => {
  //       entradas.push(evn)
  //     });

  //   } catch (error) {
  //     console.log(error)
  //   }
  //   return entradas
  // }

  // AgregarEntrada(entradas : Array<Entrada>, uid_evento : string){
  //   localStorage.setItem(`${uid_evento}_entradas_vendidas`, JSON.stringify(entradas))
  // }

  // ObtenerEntradas(uid_evento : string) : Array<Entrada> {
  //   let entradas : Array<Entrada> = []
  //   try {
  //     let rt = JSON.parse(localStorage.getItem(`${uid_evento}_entradas_vendidas`) as string)
  //     if(rt == null) {
  //       throw new Error("No hay Entradas")
  //     }
    
  //     rt.forEach((evn : Entrada) => {
  //       entradas.push(evn)
  //     });

  //   } catch (error) {
  //     console.log(error)
  //   }
  //   return entradas
  // }

  //#endregion

  GuardarEventoSeleccionadoLocalstorage(evento : Evento){
    localStorage.setItem("mi_evento", JSON.stringify(evento))
  }

  ObtenerMiEventoLocalstorage() : Evento {
    let evento = new Evento
    let rt = JSON.parse(localStorage.getItem("mi_evento") as string) 
    if(rt != null) {
      evento = rt as Evento
    } 
    return evento
  }

  BorrarEventoLocalstorage(){
    localStorage.removeItem("mi_evento")
  }

  GuardarUsuarioLocalstorage(usuario : Usuario){
    usuario.clave = ""
    localStorage.setItem("mi_usuario", JSON.stringify(usuario))
  }

  ObtenerMiUsuarioLocalstorage() : Usuario {
    let mi_usuario = new Usuario
    let rt = JSON.parse(localStorage.getItem("mi_usuario") as string) 
    if(rt != null) {
      mi_usuario = rt as Usuario
    } 
    return mi_usuario
  }

  BorrarUsuarioLocalstorage(){
    localStorage.removeItem("mi_usuario")
  }

  //#region Query Usuario

  async TraerUsuariosPorNombre(nombre : string) {
    let data:any;
    const q = query(collection(this.firestore, 'usuarios'), where("nombre", "==", nombre));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      data = JSON.parse(JSON.stringify(doc.data()))
    });

    return data
  }

  //#endregion
  
  //#region Querys Evento

  AgregarEvento(evento : Evento){
    let ok = true
    const coleccion = collection(this.firestore, 'eventos')
    const documento = doc(coleccion);
    const uid = documento.id;
    evento.uid = uid
    setDoc(documento, JSON.parse(JSON.stringify(evento))).then((val) =>{
      
    }).catch((err) => {
      console.log(err)
      ok = false
    });

    return ok
  }

  ObtenerEventosObservableUidUsuario(uid_admin : string){
    const q = query(collection(this.firestore,'eventos'),where('uid_admin','==',uid_admin));
    return collectionData(q)
  }

  ModificarEvento(evento : Evento){
    let ok = true
    const coleccion = collection(this.firestore,`eventos`)
    const documento = doc(coleccion,evento.uid);
    let obj = JSON.parse(JSON.stringify(evento));
    let rt = updateDoc(documento,obj).
    then((val) =>{
      console.log(val)
    }).catch((err) => {
      console.log(err)
      ok = false
    });

    return ok
  }


  //#endregion

  //#region Querys Plantillas y Entradas

  AgregarPlantilla(plantilla : Plantilla_Entrada, uid_evento : string){
    let ok = true
    const coleccion = collection(this.firestore, `${uid_evento}_plantillas`)
    const documento = doc(coleccion);
    const uid = documento.id;
    plantilla.uid = uid
    setDoc(documento, JSON.parse(JSON.stringify(plantilla))).catch((err) => {
      console.log(err)
      ok = false
    });

    return ok
  }

  ObtenerPlantillasEventoObservable(uid_evento : string){
    const coleccion = collection(this.firestore, `${uid_evento}_plantillas`)
    return collectionData(coleccion);
  }

  AgregarEntrada(entrada : Entrada, plantilla : Plantilla_Entrada, uid_evento : string){
    let ok = true
    const coleccion = collection(this.firestore, `${uid_evento}_entradas`)
    const documento = doc(coleccion);
    const uid = documento.id;
    entrada.uid = uid
    let rt = setDoc(documento, JSON.parse(JSON.stringify(entrada))).then((val) =>{
      ok = this.ModificarEntradasVendidasPlantilla(plantilla,uid_evento)
    }).catch((err) => {
      console.log(err)
      ok = false
    });

    return ok
  }

  private ModificarEntradasVendidasPlantilla(plantilla : Plantilla_Entrada, uid_evento : string,mas : boolean = true){
    let ok = true
    if(mas){
      plantilla.entradas_vendidas++
    } else {
      plantilla.entradas_vendidas--
    }
    const coleccion = collection(this.firestore,  `${uid_evento}_plantillas`)
    const documento = doc(coleccion, plantilla.uid)
    let rt = updateDoc(documento,{
      entradas_vendidas:plantilla.entradas_vendidas
    }).then((val) =>{
      console.log(val)
    }).catch((err) => {
      console.log(err)
      ok = false
    });

    return ok
  }

  ObtenerEntradasObservable(uid_evento : string){
    const coleccion = collection(this.firestore, `${uid_evento}_entradas`)
    return collectionData(coleccion);
  }

  CambiarAsistenciaEntrada(uid_entrada : string, uid_evento : string){
    let ok = true
    const coleccion = collection(this.firestore,  `${uid_evento}_entradas`)
    const documento = doc(coleccion, uid_entrada)
    let rt = updateDoc(documento,{
      asistio_cliente:true
    }).then((val) =>{
      console.log(val)
    }).catch((err) => {
      console.log(err)
      ok = false
    });

    return ok
  }

  EliminarEntrada(uid_entrada : string, plantilla : Plantilla_Entrada, uid_evento : string) {
    let ok = true
    const coleccion = collection(this.firestore,`${uid_evento}_entradas`)
    const documento = doc(coleccion,uid_entrada);
    let rt = deleteDoc(documento).then((val) =>{
      ok = this.ModificarEntradasVendidasPlantilla(plantilla,uid_evento,false)
    }).catch((err) => {
      console.log(err)
      ok = false
    });

    return ok
  }

  EliminarPlantilla(uid_plantilla : string, uid_evento : string) {
    let ok = true
    const coleccion = collection(this.firestore,`${uid_evento}_plantillas`)
    const documento = doc(coleccion,uid_plantilla);
    let rt = deleteDoc(documento).then((val) =>{
      console.log(val)
    }).catch((err) => {
      console.log(err)
      ok = false
    });;

    return ok
  }

  //#endregion
}
