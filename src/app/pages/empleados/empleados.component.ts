import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { User } from 'src/app/core/models/auth.models';
import { EMP } from 'src/app/core/models/emp';
import { CacheService } from 'src/app/core/services/cache.service';
import { ConfiguracionService } from 'src/app/core/services/configuracion.service';
import { EventService } from 'src/app/core/services/event.service';
import { GlobalComponent } from 'src/app/global-component';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})
export class EmpleadosComponent {
  customers!: EMP[];
  user!:User
  data!: any[];
  generos:any
  tipocontrato:any
 private config = inject(ConfiguracionService);
  private cacheSubscription!: Subscription;
  constructor(private servicios:EventService,private router: Router,private cacheService: CacheService,){
    this.generos=this.config.getegeneros()
    this.tipocontrato=this.config.gettipocontrato()
    this.cacheSubscription = this.cacheService.cache$.subscribe(data => {
      if(data!=null){
      if(data.clase=="empleados"){
        this.customers = data.data;
      }
    }
    });
    
    this.getData("empleados");    
     }
    //  ngOnInit(): void {
    //      this.bookData$ = this.servicios.getData();
    //    }
    getData(page: string): void {
    const cachedData = this.cacheService.get(page);

    // Si los datos no están en caché, los recuperamos del servidor y los almacenamos en la caché.
    if (!cachedData) {
      this.user = JSON.parse(localStorage.getItem(GlobalComponent.CURRENT_USER)!);

    }
  }
  
    onCloneIconClick = (e: DxDataGridTypes.ColumnButtonClickEvent) => {
      this.servicios.modificarObjeto(e.row?.data)
      this.servicios.modificarObjetoarray(this.customers)
      this.router.navigate(['/empleadosdetalle']);
    };
    ngOnDestroy(): void {
      // Nos desuscribimos de la caché y borramos los datos de la caché cuando se destruye el componente.
     // this.cacheSubscription.unsubscribe();
     //  this.cacheService.clear('1'); // puedes adaptar esto según tu lógica para limpiar el caché
    }
    }
