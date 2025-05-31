import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Component pages
import { ExtrapagesRoutingModule } from './extraspages-routing.module';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { RegistrarseComponent } from './registrarse/registrarse.component';
import { NgbNavModule, NgbDropdownModule, NgbAccordionModule, NgbTooltipModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MaintenanceComponent,
    ComingSoonComponent,
    RegistrarseComponent
  ],
  imports: [
    CommonModule, NgbNavModule,ReactiveFormsModule,
    ExtrapagesRoutingModule
  ]
})
export class ExtraspagesModule { }
