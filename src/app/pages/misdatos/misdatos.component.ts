import { Component } from '@angular/core';
import { User } from 'src/app/core/models/auth.models';
import { GlobalComponent } from 'src/app/global-component';

@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.scss']
})
export class MisdatosComponent {
  user!: User;
 constructor() 
   {
        this.user = JSON.parse(
                   localStorage.getItem(GlobalComponent.CURRENT_USER)!
                 );
    
 
    }
}
