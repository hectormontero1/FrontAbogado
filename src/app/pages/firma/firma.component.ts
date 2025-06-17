import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';

@Component({
  selector: 'app-firma',

  templateUrl: './firma.component.html',
  styleUrl: './firma.component.scss'
})
export class FirmaComponent {
firmas2: any[] = [];
firmas: any[] = [];
mostrarConfirmacion = false;
pagina = 1;
pdfSrc: any = null;pdfViewerContainer!: HTMLElement;
pdfBase64: any = null;
pdfInfo: any;
firmaAncho:number=5
firmaAltura:number=5
totalPaginas = 0;
archivoNombre=""
archivoNombrec=""
certificadoBase64: string = '';
constructor(private service:EventService,private router: Router){
  
}
  async agregarFirma(event: MouseEvent) {
 const container = this.pdfViewerContainer; // debes haberlo definido en onPdfLoaded
  const boundingRect = container.getBoundingClientRect();
  const clickX = event.clientX - boundingRect.left;
  const clickY = event.clientY - boundingRect.top;
  const canvas = this.pdfViewerContainer.querySelector('canvas') as HTMLCanvasElement;
  const canvasRect = canvas.getBoundingClientRect();
  const scaleX2 = this.pdfInfo.pageInfo[0].width / canvas.offsetWidth;
  const scaleY2 = this.pdfInfo.pageInfo[0].height / canvas.offsetHeight;
  const realX = (event.clientX - canvasRect.left) * scaleX2;
  const realX2 = (event.clientY - canvasRect.top) * scaleY2;
  this.firmas.push({
    posX: clickX,
    posY: clickY,
    Ancho: this.firmaAncho,
    Alto: this.firmaAltura,
    pagina: this.pagina
  });
   this.firmas2.push({
    posX: realX,
    posY: realX2,
    Ancho: this.firmaAncho,
    Alto: this.firmaAltura,
    pagina: this.pagina
  });
}
getFirmasDePaginaActual() {
  return this.firmas.filter(f => f.pagina === this.pagina);
}
eliminarFirma(index: number, event: MouseEvent) {
  event.stopPropagation(); // evita que vuelva a disparar agregarFirma
  this.firmas.splice(index, 1);
  this.firmas2.splice(index, 1);
}
  mostrarPopup() {
    this.mostrarConfirmacion = true;
  }

  cerrarPopup() {
    this.mostrarConfirmacion = false;
  }
onPdfLoaded(pdf: any) {
 console.log('PDF cargado correctamente', pdf);


 
this.totalPaginas = pdf.numPages;
this.pdfInfo = pdf;
const numPages = pdf.numPages;
  const pagePromises = [];

  for (let i = 1; i <= numPages; i++) {
    pagePromises.push(pdf.getPage(i).then((page: any) => ({
      width: page.view[2],
      height: page.view[3],
    })));
  }

  Promise.all(pagePromises).then((pageDims) => {
    this.pdfInfo.pageInfo = pageDims;
  });

  // Esperar que se renderice el DOM
  setTimeout(() => {
    this.pdfViewerContainer = document.querySelector('.pdf-container')!;
    if (!this.pdfViewerContainer) {
      console.warn('No se encontró el contenedor .pdf-container');
    } else {
      console.log('Contenedor PDF encontrado:', this.pdfViewerContainer);
    }
  }, 100);
}
paginaAnterior() {
  if (this.pagina > 1) {
    this.pagina--;
  }
}
paginaSiguiente() {
  if (this.pagina < this.totalPaginas) {
    this.pagina++;
  }
}
Procesar(){

}
onFileSelected(event: Event, tipo: 'pdf' | 'certificado' | 'qr') {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
       const base64String = (reader.result as string).split(',')[1]; 
       if (tipo === 'pdf') {
   this.mostrarConfirmacion = true;
    this.pdfSrc = 'data:application/pdf;base64,' + base64String;
    this.pdfBase64 = base64String;
     this.pagina = 1;
     this.archivoNombre=file.name
      console.log(this.pdfSrc); // ¿muestra algo?
      }
    else if (tipo === 'certificado') this.archivoNombrec=file.name ;this.certificadoBase64 = base64String;
    
  }
reader.readAsDataURL(file);
}
firmar() {
  if (!this.pdfBase64 || !this.certificadoBase64) {
    alert('Debe seleccionar PDF y certificado');
    return;
  }
   this.service.enviarccertificado(this.certificadoBase64);
 this.service.cambiarDato(this.pdfBase64);
 this.router.navigate(['/terminarfirma']);
}

onFileDropped(event: DragEvent, tipo: 'pdf' | 'certificado' | 'qr') {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
       const reader = new FileReader();
    reader.onload = () => {
       const base64String = (reader.result as string).split(',')[1]; 
       if (tipo === 'pdf') {
   this.mostrarConfirmacion = true;
    this.pdfSrc = 'data:application/pdf;base64,' + base64String;
    this.pdfBase64 = base64String;
     this.pagina = 1;
     this.archivoNombre=file.name
      console.log(this.pdfSrc); // ¿muestra algo?
      }
    else if (tipo === 'certificado') this.archivoNombrec=file.name ;this.certificadoBase64 = base64String;
    
  }
reader.readAsDataURL(file);
      // Aquí puedes procesar el archivo
    }
  }
}
