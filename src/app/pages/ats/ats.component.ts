import { LoadingService } from './../../core/services/loading.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, enableProdMode } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from 'src/app/account/login/toast-service';
import { ConfiguracionService } from 'src/app/core/services/configuracion.service';
import { GlobalComponent } from 'src/app/global-component';
if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}
@Component({
  selector: 'app-ats',
  templateUrl: './ats.component.html',
  styleUrl: './ats.component.scss'
})
export class ATSComponent {
  isDropZoneActive = false;
  backatsurl!:string
  meses: { label: string; value: string }[] = [];
  establecimientos: { label: string; value: string }[] = [];
  imageSource = '';
errorMessage: string = ''; 
  textVisible = true;
  fileToUpload: File | null = null;
  progressVisible = false;
 anios: number[] = [];
  anioSeleccionado!: number;
  mesSeleccionado!: string;
  nombreArchivo !: string;
  EstablecimintoSeleccionado!: string;
  progressValue = 0;

  allowedFileExtensions: string[] = ['.xlxs', '.xls'];

  constructor(public toastService: ToastService,private http: HttpClient,private config: ConfiguracionService,public loading: LoadingService ) {

this.meses.push({ label: "Enero", value: '01' });
this.meses.push({ label: "Febrero", value: '02' });
this.meses.push({ label: "Marzo", value: '03' });
this.meses.push({ label: "Abril", value: '04' });
this.meses.push({ label: "Mayo", value: '05' });
this.meses.push({ label: "Junio", value: '06' });
this.meses.push({ label: "Julio", value: '07' });
this.meses.push({ label: "Agosto", value: '08' });
this.meses.push({ label: "Septiembre", value: '09' });
this.meses.push({ label: "Octubre", value: '10' });
this.meses.push({ label: "Noviembre", value: '11' });
this.meses.push({ label: "Diciembre", value: '12' });

this.establecimientos.push({ label: "001", value: '001' });
this.establecimientos.push({ label: "002", value: '002' });
this.establecimientos.push({ label: "003", value: '003' });
this.establecimientos.push({ label: "004", value: '004' });
this.establecimientos.push({ label: "005", value: '005' });
this.establecimientos.push({ label: "006", value: '006' });
this.establecimientos.push({ label: "007", value: '007' });
    const anioActual = new Date().getFullYear();
    for (let i = 2024; i <= anioActual+15; i++) {
      this.anios.push(i);
    }
  }



    handleFileInput(event: Event) {
       const input = event.target as HTMLInputElement;
       
  if (input?.files?.length) {
     this.nombreArchivo = input.files[0].name;
      this.fileToUpload = input.files[0];  // Tomamos el primer archivo
          if (!this.fileToUpload.name.endsWith('.zip') && !this.fileToUpload.name.endsWith('.xlsx')) {
        this.errorMessage = 'Por favor, selecciona un archivo Excel (.xls o .xlsx)';
        this.fileToUpload = null;
        return;
      }
    }
  }
  
   uploadFile() {
     this.loading.showSpinner2("Consultando")
    if (this.fileToUpload) {
      const formData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);

      // Aquí se realiza la llamada al servidor (ejemplo usando un endpoint ficticio)
      this.http.post(this.config.apiUrl+"ATS/import?anio="+this.anioSeleccionado+"&mes="+this.mesSeleccionado+"&Estab="+this.EstablecimintoSeleccionado, formData,{
  responseType: 'text'  // 👈 aquí está el cambio clave
}) .subscribe({
      next: (blob2:any) => {
              try {
       const blob = new Blob([blob2], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'archivo.xml';
  a.click();
  URL.revokeObjectURL(url);
              this.loading.closeSpinner()
            } catch (error:any) {
          this.loading.closeSpinner()
          this.toastService.show(error, { classname: 'bg-danger text-white', delay: 2500 });
              // maneja el error como prefieras aquí
            }
      },
      error: (error: HttpErrorResponse) => {
        this.loading.closeSpinner()
      
        this.toastService.show(error.message, { classname: 'bg-danger text-white', delay: 2500 });
      }
    });


        // .pipe(
        //   catchError(error => {
        //     this.loading.closeSpinner()
        //       this.toastService.show(error, { classname: 'bg-danger text-white', delay: 2500 });
        //     console.error('Error uploading file', error);
        //     return throwError(error);
        //   })
        // )
          

    } else {
      alert('Please select a file first');
    }
  }

}
