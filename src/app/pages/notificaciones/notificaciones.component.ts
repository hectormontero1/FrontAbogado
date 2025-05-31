import { Component, inject } from '@angular/core';
import * as moment from 'moment';
import { User } from 'src/app/core/models/auth.models';
import { ConfiguracionService } from 'src/app/core/services/configuracion.service';
import { EventService } from 'src/app/core/services/event.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { GlobalComponent } from 'src/app/global-component';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss']
})
export class NotificacionesComponent {
    private servicios = inject(EventService);
    private config = inject(ConfiguracionService);
    private loading = inject(LoadingService);
  listadonotificaciones:any
  fechini!: Date;
  fechfin!: Date;
   user!: User;
  constructor() 
   {
    this.fechini= new Date()
    this.fechfin= new Date()
    
 
    }
     consultar(){
          this.loading.showSpinner2("Consultando")
                this.user = JSON.parse(
                  localStorage.getItem(GlobalComponent.CURRENT_USER)!
                );
                var laFecha = moment(this.fechini!);
                var laFecha2 = moment(this.fechfin!);
          this.servicios
          .consultarNotificaciones(this.user.IdUsuario!,laFecha.toDate().toDateString(),laFecha2.toDate().toDateString())
          .subscribe((data:any) => {
            try {
             
              this.listadonotificaciones=data
              this.loading.closeSpinner()
            } catch (error) {
              console.error(error);
              this.loading.closeSpinner()
   
              // maneja el error como prefieras aquí
            }
          });
        }
}
