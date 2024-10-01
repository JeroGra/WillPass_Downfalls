import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, PickerController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Entrada } from 'src/app/entities/entrada';
import { Evento } from 'src/app/entities/evento';
import { Plantilla_Entrada } from 'src/app/entities/plantilla_entrada';
import { DataBaseService } from 'src/app/services/data-base.service';
import { QrService } from 'src/app/services/qr.service';
import { ApexChart, ApexNonAxisChartSeries, ApexResponsive, ApexTitleSubtitle, ApexTheme, 
  ChartComponent, ApexAxisChartSeries, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexGrid, 
  ApexXAxis, ApexLegend } from "ng-apexcharts";
import { Usuario } from 'src/app/entities/usuario';

export type ChartOptionsEntradas = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  theme: ApexTheme;
  title: ApexTitleSubtitle;
};

export type ChartOptionsVentasFecha = {
  series: ApexAxisChartSeries ;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
};


@Component({
  selector: 'app-mi-evento',
  templateUrl: './mi-evento.page.html',
  styleUrls: ['./mi-evento.page.scss'],
  providers : []
})

export class MiEventoPage implements OnDestroy {

  loading = true
  plantillas : Array<Plantilla_Entrada> = []
  todas_las_entradas : Array<Entrada> = []
  mi_evento : Evento = new Evento
  entrada_validada = new Entrada
  usuario : Usuario = new Usuario
  dni_cliente : any
  plantilla_selecionada : Plantilla_Entrada = new Plantilla_Entrada
  plantilla_select = false
  listarEntradas = false
  flash_active = false

  //#region Variables Creacion Plantilla
  plantilla_automatica = "personalizada"
  nombre_plantilla = ""
  error_nombre_plantilla = ""
  valor_plantilla = 0
  error_valor_plantilla = ""
  descripcion_plantilla = ""
  error_descripcion_plantilla = ""
  esVip = false
  esPuerta = false
  creado_plantilla = false
  //#endregion

  //#region Variables Para Validacion de Entradas
  validando_entradas = false
  buscando = false
  existe = false
  no_existe = false
  //#endregion

  //#region Variables Para Graficos/Estadisticas 
  ver_estadisticas = false
  @ViewChild("chartEntradas") chartEntradas: ChartComponent | any;
  @ViewChild("chartVentasFecha") chartVentasFecha: ChartComponent | any ;
  chartOptionsEntradas: Partial<ChartOptionsEntradas> | undefined;
  chartOptionsVentasFecha: Partial<ChartOptionsVentasFecha> | undefined;

  entradas_totales = 0
  no_asistencias = 0
  asistencias = 0
  entradas_vip = 0
  entradas_en_puerta = 0
  ventas_por_fecha : Array<any> = []
  total_generado = 0
  //#endregion

  subPlantillas = new Subscription
  subEntradas = new Subscription

  constructor(private pickerCtrl: PickerController, private toastController : ToastController, 
    private bd : DataBaseService, private ruta : NavController, public qr : QrService) {
      this.mi_evento = this.bd.ObtenerMiEventoLocalstorage()
      this.usuario = this.bd.ObtenerMiUsuarioLocalstorage()
      this.ObtenerPlantillasEntradas()
     }

  ObtenerPlantillasEntradas(){
    this.subPlantillas = this.bd.ObtenerPlantillasEventoObservable(this.mi_evento.uid).subscribe((plantillas : any) => {
      this.plantillas = plantillas as Plantilla_Entrada[]
    })
    this.subEntradas = this.bd.ObtenerEntradasObservable(this.mi_evento.uid).subscribe((entradas : any) => {
      this.todas_las_entradas = entradas as Entrada[]
      this.loading = false
    })
  }

  async openPicker() {
    const picker = await this.pickerCtrl.create({
      columns: [
        {
          name: 'plantillas',
          options: [
            {
              text: 'General Pre-Venta',
              value: 'general',
            },
            {
              text: 'Vip Pre-Venta',
              value: 'vip',
            },
            {
              text: 'General Puerta',
              value: 'general_puerta',
            },
            {
              text: 'Vip Puerta',
              value: 'vip_puerta',
            },
            {
              text: 'Personalizada',
              value: 'personalizada',
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
            console.log(`You selected: ${value.plantillas.value}`);
            this.plantilla_automatica = value.plantillas.value
            this.PlantillaAutomatica(this.plantilla_automatica)
          },
        },
      ],
    });

    await picker.present();
  }

  onCheckboxVipChange(event: any) {
    console.log('Checkbox state:', this.esVip); // Muestra el valor del checkbox en la consola
  }

  onCheckboxPuertaChange(event: any) {
    console.log('Checkbox state:', this.esPuerta); // Muestra el valor del checkbox en la consola
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

  //#region  Creacion de Plantilla
  CrearNuevaPlantilla(){
    this.creado_plantilla = true
  }

  CrearPlantila(){
    
    if(this.nombre_plantilla.length <= 20 && this.nombre_plantilla.length >= 3){
      this.error_nombre_plantilla = ""
    } else {
      this.error_nombre_plantilla = "Coloque entre 3 a 20 caracteres"
    }

    if(this.descripcion_plantilla.length <= 50){
      this.error_descripcion_plantilla = ""
    } else {
      this.error_descripcion_plantilla = "Coloque maximo 50 caracteres"
    }

    if(this.valor_plantilla >= 0){
      this.error_valor_plantilla = ""
    } else {
      this.error_valor_plantilla = "No se permiten valores menores a 0"
    }

    if(this.error_nombre_plantilla == "" && this.error_descripcion_plantilla == "" && this.error_valor_plantilla == ""){
      let plantilla = new Plantilla_Entrada(this.nombre_plantilla,this.esVip,this.esPuerta,this.valor_plantilla,this.descripcion_plantilla)
      this.loading = true
      plantilla.uid_evento = this.mi_evento.uid 
      let ok = this.bd.AgregarPlantilla(plantilla,this.mi_evento.uid)
      this.loading = false
      if(ok){ this.presentToast("top","Entrada Agregada!","success") }else{ this.presentToast("top","Error con la conexion","danger") } 
      this.VolverPlantillas()
    } else {
      this.presentToast("top","Faltan campos por completar","danger")
    }

  }

  VolverPlantillas(){
    this.creado_plantilla = false
    this.plantilla_automatica = "personalizada"
    this.PlantillaAutomatica("personalizada")
  }

  PlantillaAutomatica(plantilla : string) {
    switch(plantilla)
    {
      case 'general':
        this.nombre_plantilla = "General Pre-Venta"
        this.descripcion_plantilla = "Entrada general anticipada a la fecha"
        this.esVip = false
        this.esPuerta = false
      break

      case 'vip':
        this.nombre_plantilla = "Vip Pre-Venta"
        this.descripcion_plantilla = "Entrada vip anticipada a la fecha"
        this.esVip = true
        this.esPuerta = false
      break

      case 'general_puerta':
        this.nombre_plantilla = "General En Puerta"
        this.descripcion_plantilla = "Entrada general solo venta en puerta"
        this.esVip = false
        this.esPuerta = true
      break

      case 'vip_puerta':
        this.nombre_plantilla = "Vip En Puerta"
        this.descripcion_plantilla = "Entrada vip solo venta en puerta"
        this.esVip = true
        this.esPuerta = true
      break

      case 'personalizada':
        this.nombre_plantilla = ""
        this.descripcion_plantilla = ""
        this.esVip = false
        this.esPuerta = false
      break
    }
    this.valor_plantilla = 0
  }

  SelecionarPlantillaEntrada(plantilla : Plantilla_Entrada){
    if(this.usuario.admin || this.usuario.editor){
      this.plantilla_selecionada = plantilla
      this.plantilla_select = true
    } else {
      this.presentToast("top","No Tienes los permisos para acceder a esta opción","warning")
    }
  }

  DeselctPlantillaEntrada(){
    this.plantilla_selecionada = new Plantilla_Entrada
    this.plantilla_select = false
  }


  SubirEntrada(entrada:Entrada){
    this.loading = true
    let ok = this.bd.AgregarEntrada(entrada,this.plantilla_selecionada,this.mi_evento.uid)
    this.loading = false
    if(ok){ this.presentToast("top","Entrada Agregada!","success") }else{ this.presentToast("top","Error con la conexion","danger") } 
  }
  //#endregion

  //#region Validacion de Entrada
  ValidarEntradas(){
    this.validando_entradas = true
  }

  CancelarValidacion(){
    this.validando_entradas = false
    this.dni_cliente = undefined
    if(this.qr.scan){
      this.qr.StopScan()
    }
  }

  Flashlight(){
    if(!this.flash_active){
      this.flash_active = true
      this.qr.FlashOn()
    } else {
      this.flash_active = false
      this.qr.FlashOff()
    }
  }
  

  ScanDNI(){
    this.VolverValidacion()
    try
    {
      this.qr.StartScan().then(()=>{

        if(this.qr.scanResult != "Error. No hay Permisos"){
          if(this.qr.scanResult != "Stop Scan"){
            let arrData = []
            arrData = this.qr.scanResult?.split('@');
            this.dni_cliente = parseInt(arrData[4]);
      
            if(this.dni_cliente >= 1000000 && this.dni_cliente <= 99999999){
              this.Validar()
            } else {
              this.presentToast("top","Error, no es un DNI valido")
            }
          }
        } else {
          this.presentToast("top","Error, No hay permisos de camara","warning")
        }
      })
    }
    catch
    {
      this.presentToast("top","Error al abrir escaner")
    }

  }

  Validar(){
    this.buscando = true
    this.loading = true
    // LISTA EN MEMORIA (TRABAJA CON LAS ENTRADAS EN MEMORIA (CONSUME MAS RAM))
    let existe = false
    for(let i = 0; i < this.todas_las_entradas.length; i++){
      if(this.todas_las_entradas[i].dni === this.dni_cliente){
        existe = true
        this.entrada_validada = this.todas_las_entradas[i]
        break;
      }
    }

    this.loading = false
    if(existe){
      this.buscando = false
      this.existe = true
      if(!this.entrada_validada.asistio_cliente) {
          let ok = this.bd.CambiarAsistenciaEntrada(this.entrada_validada.uid,this.mi_evento.uid)
          if(!ok){ this.presentToast("top","Error con la conexion","danger") }
      }
    } else {
      this.buscando = false
      this.no_existe = true
    }

    // QUERY A BD (BUSCAR POR QUERY (HACE MAS LLAMADOS A BD))

  }

  Buscar(){
    if(this.dni_cliente !== undefined){
      if(this.dni_cliente.toString().length >= 7 &&  this.dni_cliente.toString().length <= 8){
        this.Validar()
      } else {
        this.presentToast("top","Coloque un dni valido","danger")
      }
    } else {
      this.presentToast("top","Coloque un dni valido","danger")
    }
  }

  VolverValidacion(){
    this.existe = false
    this.no_existe = false
    this.buscando = false
    this.dni_cliente = undefined
  }

  //#endregion

  ListarEntradas(){
    if(!this.listarEntradas){
      this.listarEntradas = true
    } else {
      this.listarEntradas = false
    }
  }

  //#region GRAFICOS y ESTADISTICAS

  VerEstadisticas(){
    if(this.usuario.admin){
      if(!this.ver_estadisticas){
        this.ver_estadisticas = true
        this.GenerarEstadisticas()
      } else {
        this.ver_estadisticas = false
        this.BorrarEstadisticas()
      }
    } else {
      this.presentToast("top","No Tienes los permisos para acceder a esta opción","warning")
    }
  }

  BorrarEstadisticas(){
    this.entradas_totales = 0
    this.no_asistencias = 0
    this.asistencias = 0
    this.entradas_vip = 0
    this.entradas_en_puerta = 0
    this.ventas_por_fecha = []
    this.total_generado = 0
  }

  GenerarEstadisticas(){

    this.entradas_totales = this.todas_las_entradas.length

    this.todas_las_entradas.forEach((entrada : Entrada) => {

      this.total_generado += entrada.valor

      if(entrada.asistio_cliente){
        this.asistencias += 1
      } else {
        this.no_asistencias += 1
      }

      if(entrada.vip){
        this.entradas_vip += 1
      }

      if(entrada.en_puerta){
        this.entradas_en_puerta += 1
      }
      
      //Comprueba si hay mas entradas vendidas en la misma fecha

      let fecha_venta_actual = new Date(entrada.fecha_venta)
      let existe = false

      for(let i = 0; i < this.ventas_por_fecha.length; i++){
        let fecha_existente = new Date(this.ventas_por_fecha[i].fecha)
        if(fecha_venta_actual.getTime() === fecha_existente.getTime()){
          this.ventas_por_fecha[i].ventas += 1
          existe = true
          break;
        }
      }

      if(!existe){
        let venta_fecha = {
          ventas:1,
          fecha:entrada.fecha_venta
        }
        this.ventas_por_fecha.push(venta_fecha)
      }

    })
    
    console.log(this.ventas_por_fecha)
    //LLamada a la creacion de graficos
    this.GraficoEntradas()
    this.GraficoVentas()
  }

  GraficoEntradas() {
    this.chartOptionsEntradas = {
      series: [this.asistencias, this.no_asistencias],
      chart: {
        width: "105%",
        type: "pie",
      },
      labels: [
        "Asistencias",
        "Ausencias ",
      ],
      theme: {
        monochrome: {
          enabled: false
        }
      },
      responsive: [
        {
          breakpoint: 300,
          options: {
            chart: {
              width: 600
            },
            legend: {
              position: "top"
            }
          }
        }
      ]
    };
  }

  GraficoVentas() {

    let data : any = []
    let categorias : any  = []
    let aux : any

    for(let i = 0; i < this.ventas_por_fecha.length - 1; i++){
      for(let x = i + 1; x < this.ventas_por_fecha.length; x++){
        let dateA = new Date(this.ventas_por_fecha[i].fecha).getTime()
        let dateB = new Date(this.ventas_por_fecha[x].fecha).getTime()
        if(dateA < dateB){
          aux = this.ventas_por_fecha[i]
          this.ventas_por_fecha[i] = this.ventas_por_fecha[x]
          this.ventas_por_fecha[x] = aux
        }

      }
    }

    this.ventas_por_fecha.forEach((venta:any) => {
      data.push(venta.ventas)
      categorias.push(venta.fecha)
    })
    

    this.chartOptionsVentasFecha = {
      series: [
        {
          name: "Ventas",
          data: data
        },
      ],
      chart: {
        height: 350,
        type: "bar",
        events: {

          
        },
        toolbar : {
          show : false,
        },
      },
      colors: [
        // "#F87983",
        // "#A28BF7",
        "#292929"
      ],
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius:4,
          borderRadiusApplication: 'end',
          distributed: true
        },
      },
      dataLabels: {
        enabled: false,
        style: {
          colors: ["#000"]
        },
      },
      legend: {
        show: false
      },
      grid: {
        show: false
      },
      xaxis: {
        categories: categorias,
        labels: {
          style: {
            colors: [

            ],
            fontSize: "0.8rem"
          }
        }
      },
    };

  }

  //#endregion

  EliminarEntrada(entrada : Entrada){
    this.loading = true
    let mi_plantilla = new Plantilla_Entrada
    this.plantillas.forEach((plantilla:Plantilla_Entrada) => {
      if(entrada.uid_plantilla == plantilla.uid){
        mi_plantilla = plantilla
      }
    })
    let ok = this.bd.EliminarEntrada(entrada.uid,mi_plantilla,this.mi_evento.uid)
    this.loading = false
    if(ok){ this.presentToast("top","Se elimino correctamente","success") }else{ this.presentToast("top","Error con la conexion","danger") } 
  }

  EliminarPlantilla(plantilla : Plantilla_Entrada){
    this.loading = true
    let ok = this.bd.EliminarPlantilla(plantilla.uid,this.mi_evento.uid)
    this.loading = false
    if(ok){ this.presentToast("top","Se elimino Plantilla correctamente","success") }else{ this.presentToast("top","Error con la conexion","danger") } 
  }

  Volver(){
    this.DeselctPlantillaEntrada()
    this.mi_evento = new Evento
    this.plantillas = []
    this.todas_las_entradas = []
    this.bd.BorrarEventoLocalstorage()
    this.ruta.navigateRoot(['/home'])
  }

  ngOnDestroy() {
    this.subPlantillas.unsubscribe()
  }

}
