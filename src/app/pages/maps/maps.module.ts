import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Google Map
// Leaflet Map
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

// Component pages
import { MapsRoutingModule } from './maps-routing.module';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE'
    // }),
    LeafletModule,
    MapsRoutingModule,
    SharedModule
  ]
})
export class MapsModule { }
