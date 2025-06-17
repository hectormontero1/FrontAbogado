import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/core/services/event.service';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss']
})

/**
 * Starter Component
 */
export class StarterComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
pdfBase64: any = null;
  constructor(private service:EventService) { }
onFileSelected(event: Event, tipo: 'pdf' | 'certificado' | 'qr') {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
       const base64String = (reader.result as string).split(',')[1]; 
       if (tipo === 'pdf') {
      this.pdfBase64 = base64String;
      }
   
    
  }
reader.readAsDataURL(file);
}

enviar(){
const request = {
    pdfBytes: this.pdfBase64,

  };

  this.service.enviar(request).subscribe({
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

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Starter', active: true }
    ];
  }

}
