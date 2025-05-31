import { Component } from '@angular/core';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent {
  customers!: any[];
  constructor(private servicios:UsuarioService){
    this.servicios.Consultar().subscribe((data:any) => { 
      this.customers = data.data
    });
    
     }
     
    

}
