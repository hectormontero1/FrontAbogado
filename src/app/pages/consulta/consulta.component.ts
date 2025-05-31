import { DatePipe } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';

import * as moment from 'moment';
import { User } from 'src/app/core/models/auth.models';
import { ConfiguracionService, documento } from 'src/app/core/services/configuracion.service';
import { EventService } from 'src/app/core/services/event.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { GlobalComponent } from 'src/app/global-component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';


declare const PDFObject: any;
@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})

export class ConsultaComponent {
  @ViewChild('pdfIframe') pdfIframe!: ElementRef<HTMLIFrameElement>;
  private servicios = inject(EventService);
  private config = inject(ConfiguracionService);
  private loading = inject(LoadingService);
  tipodocumentos!: documento[];
  base64Html!: string;
  safeBase64Html!: SafeResourceUrl;
  tipo!: number;
  fechini!: Date;
  fechfin!: Date;
  fechfin2!: string;
  pdfSrc: string ="";
  base64Only: string = '';
  xmlSrc :string ="";
  iframeSrc!: SafeResourceUrl;
  fileName = 'documento.pdf';  
  listadocumentos!: any;
  popupVisible = false;
  popupVisiblexml = false;
  popupWithScrollViewVisible = false;
   user!: User;


   constructor(private sanitizer: DomSanitizer) 
   {
      this.tipodocumentos=this.config.getdocumentos()
      this.tipo=this.tipodocumentos[0].ID
      this.fechini= new Date()
      this.fechfin= new Date()
    }
      onCloneIconClick = (e: DxDataGridTypes.ColumnButtonClickEvent) => {
        this.loading.showSpinner2("Consultando")
        this.servicios
        .Consultardocumento(e.row?.data.ClaveAcceso,"PDF").subscribe(blob => {
          try {
          this.popupVisible = true; 
          //  this.isModalOpen = true;
            this.base64Only = blob.base64Data;
            this.fileName = blob.fileName;
        
            // Importante: agregar el prefijo "data:application/pdf;base64,"
            this.pdfSrc = `data:application/pdf;base64,${this.base64Only}`;
            this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
            this.loading.closeSpinner()
          } catch (error) {
            console.error(error);
            this.loading.closeSpinner()
            // maneja el error como prefieras aquí
          }
        });
        };
        descargarxml = (e: DxDataGridTypes.ColumnButtonClickEvent) => {
          this.loading.showSpinner2("Consultando")
          this.servicios
          .Consultardocumento(e.row?.data.ClaveAcceso,"XML")
          .subscribe((blob:any) => {
            try {
              this.popupVisiblexml = true; 
              this.base64Only = blob.xml;
              this.fileName = blob.fileName;
            // const parse =new DOMParser()
            this.pdfSrc = `data:application/xml;base64,${blob.base64Data}`;
            this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
             this.loading.closeSpinner()
            } catch (error) {
              console.error(error);
              this.loading.closeSpinner()
              // maneja el error como prefieras aquí
            }
          });
        };

        base64ToBlob(base64: string, mimeType: string): Blob {
          const byteCharacters = atob(base64); // Decodifica la cadena Base64 a caracteres binarios
          const byteArrays = [];
      
          for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
          }
      
          return new Blob(byteArrays, { type: mimeType });
        }
      
         MyPopUpWin(url:any, width:any, height:any) {
          var leftPosition, topPosition;
          //Allow for borders.
          leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
          //Allow for title and status bars.
          topPosition = (window.screen.height / 2) - ((height / 2) + 50);
          //Open the window.
          window.open(url, "Window2",
          "status=no,height=" + height + ",width=" + width + ",resizable=yes,left="
          + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY="
          + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no");
      }

    consultar(){

if(this.tipo==0){
this.loading.showMensajeError("Seleccione un tipo")
  
}else{
      this.loading.showSpinner2("Consultando")
            this.user = JSON.parse(
              localStorage.getItem(GlobalComponent.CURRENT_USER)!
            );
            var laFecha = moment(this.fechini!);
            var laFecha2 = moment(this.fechfin!);
      this.servicios
      .consultarDocuementos(this.user.IdUsuario?.toString()!,this.tipo, laFecha.toDate().toDateString(),laFecha2.toDate().toDateString())
      .subscribe((data:any) => {
        try {
          this.loading.closeSpinner()
          this.listadocumentos=data
        } catch (error) {
          this.loading.closeSpinner()
          console.error(error);
          
          // maneja el error como prefieras aquí
        }
      });
    }
    }
    convertBlobToBase64(blob: Blob): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          resolve(base64data);
        };
        reader.onerror = reject;
     let vo =   reader.readAsDataURL(blob);
      });
    }
    descargarPdf() {
      const link = document.createElement('a');
      link.href = this.pdfSrc!;
      link.download = this.fileName;
      link.click();
    }
    descargarXml() {
      const link = document.createElement('a');
      link.href = this.pdfSrc!;
      link.download = this.fileName;
      link.click();
    }
    imprimirPdf() {
      // const win = window.open();
      // if (win) {
      //   win.document.write(`
        //   <iframe #pdfIframe src="${this.pdfSrc}" frameborder="0" style="width:100%;height:100%;" ></iframe>
        // `);
        const iframe = this.pdfIframe.nativeElement;

        // Esperar a que el PDF se haya cargado completamente
        iframe.onload = () => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        };
      }
    }

