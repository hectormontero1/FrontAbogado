import { Component } from '@angular/core';
import { ConfiguracionService } from 'src/app/core/services/configuracion.service';

import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
@Component({
  selector: 'app-clientes',

  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent {
 customers!: any[];
    remoteDataSource: any;
  constructor(private config: ConfiguracionService ){
    const serviceUrl: String =this.config.apiUrl+  'Clientes';
     this.remoteDataSource = createStore({
    onBeforeSend: function(operation, ajaxSettings)
    {
        // ajaxSettings.headers = {
        //     "Authorization": 'Bearer ' + token
        // }
    },  onAjaxError: ({ xhr, error}) =>
      {
        // if(xhr.status == 401) {
        //   this.authService.Gettoken(this.config.Usertoken,this.config.Passtoken).pipe(
        //     switchMap((res)=>{
        //       this.authService.setAccessToken(res);
        //       return "";
        //     })
        //   )
        // }
      },
      key: 'IdCliente',
      loadUrl: serviceUrl + '/Get',
      insertUrl: serviceUrl + '/Post',
      updateUrl: serviceUrl + '/Put',
      deleteUrl: serviceUrl + '/Delete'
  });
    
     }
         onCloneIconClick = (e: DxDataGridTypes.ColumnButtonClickEvent) => {
      
         };
}
