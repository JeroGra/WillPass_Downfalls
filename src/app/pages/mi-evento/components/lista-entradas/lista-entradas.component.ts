import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Entrada } from 'src/app/entities/entrada';
import { Usuario } from 'src/app/entities/usuario';

@Component({
  selector: 'app-lista-entradas',
  templateUrl: './lista-entradas.component.html',
  styleUrls: ['./lista-entradas.component.scss'],
})
export class ListaEntradasComponent  {

  @Input() entradas : Entrada[] = []
  @Input() usuario : Usuario = new Usuario
  @Output() EliminarEntrada = new EventEmitter<Entrada>();
  entrada_select = new Entrada
  isModalOpen = false
  constructor() { }

  setOpen(isOpen : boolean, entrada : Entrada | null = null) {
    this.isModalOpen = isOpen;
    console.log(entrada)
    if(entrada != null){
      this.entrada_select = entrada
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
        this.Eliminar()
      },
    },
  ];

  setResult(ev:any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }

  Eliminar(){
    this.EliminarEntrada.emit(this.entrada_select)
    this.isModalOpen = false
    this.entrada_select = new Entrada
  }

}
