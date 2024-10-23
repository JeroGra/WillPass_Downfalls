import { Injectable } from '@angular/core';
import { Evento } from '../entities/evento';
import { Entrada } from '../entities/entrada';
import { Plantilla_Entrada } from '../entities/plantilla_entrada';
import { Firestore, documentId, updateDoc, } from '@angular/fire/firestore';
import { getDocs,setDoc,doc,addDoc,collection,deleteDoc,query,where,orderBy } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { Usuario } from '../entities/usuario';
import { Sesion } from '../entities/sesion';
import { Informacion_Evento } from '../entities/informacion_evento';

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

  // RECORDAR USUARIO

  RecordarUsuario(uid_usuario : string){
    localStorage.setItem("recordar_usuario",JSON.stringify({recordar:true,uid_usuario:uid_usuario}))
  }

  ObtenerRecordarUsuario(){
    let rt = JSON.parse(localStorage.getItem("recordar_usuario") as string) 
    if(rt != null) {
      return rt
    } 
    return null
  }

  BorrarRecordarUsuario(){
    localStorage.removeItem("recordar_usuario")
  }

  RecordarUltimaSesion(sesion : Sesion){
    localStorage.setItem("ultima_sesion",JSON.stringify(sesion))
  }

  ObtenerUltimaSesion(){
    let ultima_sesion : Sesion = JSON.parse(localStorage.getItem("ultima_sesion") as string) 
    if(ultima_sesion != null) {
      return ultima_sesion
    } 
    return null
  }

  BorrarUltimaSesion(){
    localStorage.removeItem("ultima_sesion")
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

  async TraerUsuarioUid(uid : string) {
    let data:any;
    const q = query(collection(this.firestore, 'usuarios'), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      data = JSON.parse(JSON.stringify(doc.data()))
    });

    return data
  }

  TraerUsuariosAsociados(uid_organizador : string){
    const q = query(collection(this.firestore, 'usuarios'), where("uid_organizador", "==", uid_organizador));
    return collectionData(q)
  }

  ModificarUsuario(usuario : Usuario){
    let ok = true
    const coleccion = collection(this.firestore,`usuarios`)
    const documento = doc(coleccion,usuario.uid);
    let obj = JSON.parse(JSON.stringify(usuario));
    let rt = updateDoc(documento,obj).
    then((val) =>{
      console.log(val)
    }).catch((err) => {
      console.log(err)
      ok = false
    });

    return ok
  }

  AgregarUsuario(usuario : Usuario){
    let ok = true
    const coleccion = collection(this.firestore, 'usuarios')
    const documento = doc(coleccion);
    const uid = documento.id;
    usuario.uid = uid
    setDoc(documento, JSON.parse(JSON.stringify(usuario))).then((val) =>{
      
    }).catch((err) => {
      console.log(err)
      ok = false
    });

    return ok
  }

  EliminarUsuario(uid_usuario : string) {
    let ok = true
    const coleccion = collection(this.firestore,`usuarios`)
    const documento = doc(coleccion,uid_usuario);
    let rt = deleteDoc(documento).then((val) =>{
      
    }).catch((err) => {
      console.log(err)
      ok = false
    });

    return ok
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
      let info_evento = new Informacion_Evento
      info_evento.fecha = evento.fecha
      info_evento.hora = evento.hora
      info_evento.nombre_evento = evento.nombre
      info_evento.uid_organizador = evento.uid_organizador
      info_evento.uid_evento = evento.uid
      ok = this.AgregarInformacionEvento(info_evento)
    }).catch((err) => {
      console.log(err)
      ok = false
    });

    return ok
  }

  ObtenerEventosObservableUidUsuario(uid_organizador : string){
    const q = query(collection(this.firestore,'eventos'),where('uid_organizador','==',uid_organizador));
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

  private AgregarInformacionEvento(informacion_evento : Informacion_Evento){
    let ok = true
    const coleccion = collection(this.firestore, `${informacion_evento.uid_organizador}_rendimiento_eventos`)
    const documento = doc(coleccion);
    const uid = documento.id;
    informacion_evento.uid = uid
    setDoc(documento, JSON.parse(JSON.stringify(informacion_evento))).then((val) =>{
      
    }).catch((err) => {
      console.log(err)
      ok = false
    });

    return ok
  }

  ModificarInformacioEvento(informacion_Evento : Informacion_Evento){
    let ok = true
    const coleccion = collection(this.firestore, `${informacion_Evento.uid_organizador}_rendimiento_eventos`)
    const documento = doc(coleccion,informacion_Evento.uid);
    let obj = JSON.parse(JSON.stringify(informacion_Evento));
    let rt = updateDoc(documento,obj).
    then((val) =>{
      console.log(val)
    }).catch((err) => {
      console.log(err)
      ok = false
    });

    return ok
  }

  ObtenerInformacionEventosObservable(uid_organizador : string){
    const q = query(collection(this.firestore,`${uid_organizador}_rendimiento_eventos`));
    return collectionData(q)
  }

  async TraerInformacionEventoPorUidEvento(uid_evento : string, uid_organizador : string) {
    let data:any;
    const q = query(collection(this.firestore,`${uid_organizador}_rendimiento_eventos`),where("uid_evento", "==", uid_evento));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      data = JSON.parse(JSON.stringify(doc.data()))
    });

    return data
  }

    TraerInformacionEventoPorUidEventoObservable(uid_evento : string, uid_organizador : string) {
    const q = query(collection(this.firestore,`${uid_organizador}_rendimiento_eventos`),where("uid_evento", "==", uid_evento));
    return collectionData(q)
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
      plantilla.entradas_vendidas += plantilla.cantidad_entradas
    } else {
      plantilla.entradas_vendidas -= plantilla.cantidad_entradas
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
