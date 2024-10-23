import { Entrada } from "./entrada"

export class Plantilla_Entrada {
    uid : string = ""
    uid_evento : string = ""
    nombre_entrada : string = ""
    vip : boolean = false
    en_puerta : boolean = false
    valor : number = 0
    descripcion : string = ""
    entradas_vendidas = 0
    cantidad_entradas = 1    

    constructor(nombre_entrada = "", vip = false, en_puerta = false, valor = 0, descripcion = "", cantidad_entradas = 1){
        this.nombre_entrada = nombre_entrada
        this.vip = vip
        this.en_puerta = en_puerta
        this.valor = valor
        this.descripcion = descripcion
        this.cantidad_entradas = cantidad_entradas
    }
}