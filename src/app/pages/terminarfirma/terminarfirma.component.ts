import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';

@Component({
  selector: 'app-terminarfirma',

  templateUrl: './terminarfirma.component.html',
  styleUrl: './terminarfirma.component.scss'
})
export class TerminarfirmaComponent {
  firmas2: any[] = [];
firmas: any[] = [];
totalPaginas = 0;
windowRef = window;
certificadoBase64: string = '';
pdfBase64: any = null;
firmaAncho:number=5
canvasWidth:any
canvasHeight:any
canvasElement:any
firmaAltura:number=5
mostrarConfirmacion = false;
pagina = 1;pdfInfo: any;
pdfSrc: any = null;pdfViewerContainer!: HTMLElement;

constructor(private service:EventService,private router: Router){
   this.service.dato$.subscribe({
    next: (blob) => {
     this.pdfSrc = 'data:application/pdf;base64,' +blob
     this.pdfBase64=blob
    },
    error: (err) => {
      console.error('Error al firmar PDF', err);
    },
  });
   

 this.service.certificado$.subscribe(valor => this.certificadoBase64 = valor);
  
}
getFirmasDePaginaActual() {
  return this.firmas.filter(f => f.pagina === this.pagina);
}
eliminarFirma(index: number, event: MouseEvent) {
  event.stopPropagation(); // evita que vuelva a disparar agregarFirma
  this.firmas.splice(index, 1);
  this.firmas2.splice(index, 1);
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
getFirmasDePaginaActualAbsolutas() {
  const rect = this.canvasElement?.getBoundingClientRect();
  return this.getFirmasDePaginaActual().map(f => ({
    ...f,
    absoluteX: (rect?.left ?? 0) + window.scrollX + f.posX,
    absoluteY: (rect?.top ?? 0) + window.scrollY + f.posY
  }));
}
cancelar(){
   this.router.navigate(['/firma']);
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

onPageRendered() {
  setTimeout(() => {
    const canvas = document.querySelector('.pdf-container canvas') as HTMLCanvasElement;
    if (canvas) {
      this.canvasWidth = canvas.offsetWidth;
      this.canvasHeight = canvas.offsetHeight;
      this.canvasElement = canvas;
    }
  }, 100);
}


  firmar() {
  if (!this.pdfBase64 || !this.certificadoBase64) {
    alert('Debe seleccionar PDF y certificado');
    return;
  }
  const request = {
    pdfBytes: this.pdfBase64,
    certificadoP12: this.certificadoBase64,
    password: 'Hm_0981353717', // o pedir input para contraseña
    firmas:  this.firmas2,
  };

  this.service.firmarPdf(request).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'documento-firmado.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Error al firmar PDF', err);
    },
  });
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
}
