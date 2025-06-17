import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";
import { map, filter } from "rxjs/operators";
import { GlobalComponent } from "src/app/global-component";
import { Parametros } from "./parametros";
import { NubeFactura } from "../models/factura";
import { Certificado } from "../models/certificado";
import { EMP } from "../models/emp";
import { ConfiguracionService } from "./configuracion.service";

interface Event {
  type: string;
  payload?: any;
}

type EventCallback = (payload: any) => void;
const API_URL = GlobalComponent.API_URL;
const RUC = GlobalComponent.RUC;
export interface FirmaPosicion {
  pagina: number;
  posX: number;
  posY: number;
  ancho: number;
  alto: number;
  imagenQr?: string; // base64 string
}
export interface PdfRequest {
  pdfBytes: string;        // base64 PDF
}
export interface FirmaPdfRequest {
  pdfBytes: string;        // base64 PDF
  certificadoP12: string;  // base64 certificado
  password: string;
  firmas: FirmaPosicion[];
}

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};
@Injectable({
  providedIn: "root",
})
export class EventService {
  public miObjeto: EMP = {};
  public miObjetoaray: EMP[] = [];
  private handler = new Subject<Event>();
  // searchData$: BehaviorSubject<EMP> = new BehaviorSubject<EMP>(null!);
  constructor(private http: HttpClient,private config: ConfiguracionService) {}
  getObjeto() {
    return this.miObjeto;
  }
  // sendData(term: any) {
  //   this.searchData$.next(term);
  // }
  // getData() {
  //   return this.searchData$.asObservable();
  // }
private certificado = new BehaviorSubject<any>("");
  certificado$ = this.certificado.asObservable();

  enviarccertificado(nuevoDato: any) {
    this.certificado.next(nuevoDato);
  }


private datoSource = new BehaviorSubject<any>("");
  dato$ = this.datoSource.asObservable();

  cambiarDato(nuevoDato: any) {
    this.datoSource.next(nuevoDato);
  }
  getObjetoarray() {
    return this.miObjetoaray;
  }
  modificarObjeto(nuevoObjeto: EMP) {
    this.miObjeto = nuevoObjeto;
  }
  modificarObjetoarray(miObjetoaray: EMP[]) {
    this.miObjetoaray = miObjetoaray;
  }
  /**
   * Broadcast the event
   * @param type type of event
   * @param payload payload
   */
  broadcast(type: string, payload = {}) {
    this.handler.next({ type, payload });
  }

  /**
   * Subscribe to event
   * @param type type of event
   * @param callback call back function
   */
  subscribe(type: string, callback: EventCallback): Subscription {
    return this.handler
      .pipe(filter((event) => event.type === type))
      .pipe(map((event) => event.payload))
      .subscribe(callback);
  }
  get(url: string): Observable<any> {
    return this.http.get(API_URL + url, httpOptions);
  }

  post(url: string, parametros: Parametros[]) {
    var link: string =
      url + "?" + parametros[0].nombre + "=" + parametros[0].valor;
    for (let i = 1; i < 3; i++) {
      link = link + "&" + parametros[i].nombre + "=" + parametros[i].valor;
      console.log(link);
    }
    return this.http.post(API_URL + link, httpOptions);
  }
  postfactura(url: string, factura: NubeFactura): Observable<any> {
    //console.log(JSON.stringify(factura))
    //https://localhost:7271/api/NubeFactura
    return this.http.post(this.config.apiUrl  + url, JSON.stringify(factura), httpOptions);
  }
  subircertificado(file: File, certificado: Certificado) {
    //var blob = new Blob([file], { type: "application/octet-stream" });
    const formData = new FormData();
    formData.append("ruc", certificado.ruc);
    formData.append("idcopmpania", certificado.idcompania.toString());
    formData.append("fecha", certificado.fecha);
    formData.append("clave", certificado.clave);
    formData.append("file", file, file.name);
    return this.http.post<Certificado>(
      this.config.apiUrl  + "Archivos/UploadCertificado",
      formData
    );
  }
  consultarNotificaciones(
    Cedula: string,
    fechaini: string,
    fechafin: string
  ) {
    return this.http.get<any>(
      this.config.apiUrl  +
        "Documentos/Buscarnotificaciones?Cedula=" +
        Cedula +    
        "&fechaini=" +
        fechaini +
        "&fechafin=" +
        fechafin +
        "&RUC=" +
        RUC,
      httpOptions
    );
  }
  consultarDocuementos(
    Cedula: string,
    tipodoc: number,
    fechaini: string,
    fechafin: string
  ) {
    return this.http.post<any>(
      this.config.apiUrl  +
        "Documentos/Buscar?Cedula=" +
        Cedula +
        "&tipodoc=" +
        tipodoc +
        "&fechaini=" +
        fechaini +
        "&fechafin=" +
        fechafin +
        "&RUC=" +
        RUC,
      httpOptions
    );
  }
  getArchivo(): Observable<Blob> {
    return this.http.get(this.config.apiUrl  , {
      responseType: 'blob'
    });
  }
  Consultardocumento(claveacesso: string, formato: string): Observable<any> {
    return this.http.get(
      this.config.apiUrl  +
        "Documentos/descargarRide?claveacesso=" +
        claveacesso +
        "&formato=" +
        formato
    );
  }
  Consultarpdf(usu: string, pass: string): Observable<any> {
    return this.http.get(
      this.config.apiUrl  + "Empleados/EMPRESAS?usu=" + usu + "&contrasena=" + pass,
      httpOptions
    );
  }
  ConsultarCentros(usu: string, pass: string): Observable<any> {
    return this.http.get(
      this.config.apiUrl  + "Empleados/Centro?usu=" + usu + "&contrasena=" + pass,
      httpOptions
    );
  }
    firmarPdf(request: FirmaPdfRequest) {
    return this.http.post(this.config.apiUrl+"FirmaPdf/FirmarPdf", request, { responseType: 'blob' });
  }
    enviar(request: PdfRequest) {
    return this.http.post(this.config.apiUrl+"Rag/Upload", request, { responseType: 'blob' });
  }
}
