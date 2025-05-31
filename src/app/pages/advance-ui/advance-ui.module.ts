import { AfterViewInit, Component, OnInit ,NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAccordionModule, NgbCollapseModule, NgbDropdownModule, NgbModule, NgbNavModule, NgbPaginationModule, NgbProgressbarModule, NgbRatingModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

// Simple bar
import { SimplebarAngularModule } from 'simplebar-angular';

// Nestable
import { NestableModule } from 'ngx-nestable';

// Swiper Slider




// Load Icon
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';

// Component pages
import { AsvanceUiRoutingModule } from './advance-ui-routing.module';
import { SweetalertsComponent } from './sweetalerts/sweetalerts.component';
import { ScrollbarComponent } from './scrollbar/scrollbar.component';
import { AnimationComponent } from './animation/animation.component';
import { TourComponent } from './tour/tour.component';

import { RatingsComponent } from './ratings/ratings.component';
import { HighlightComponent } from './highlight/highlight.component';
import { ScrollspyComponent } from './scrollspy/scrollspy.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DndModule } from 'ngx-drag-drop';
import { NgxMaskModule } from 'ngx-mask';
import { AppsRoutingModule } from '../apps/apps-routing.module';
import { JobsModule } from '../apps/jobs/jobs.module';


@NgModule({
  declarations: [
    SweetalertsComponent,
    ScrollbarComponent,
    AnimationComponent,
    TourComponent,
    RatingsComponent,
    HighlightComponent,
    ScrollspyComponent
  ],
  imports: [
    CommonModule,
       FormsModule,
       ReactiveFormsModule,
       NgbTooltipModule,
       NgbDropdownModule,
       NgbAccordionModule,
       NgbProgressbarModule,
       NgbNavModule,
       NgbPaginationModule,
    
       NgbCollapseModule,
       FeatherModule.pick(allIcons),
       FullCalendarModule,
       FlatpickrModule.forRoot(),
       SimplebarAngularModule,
       CKEditorModule,
       NgApexchartsModule,
       LeafletModule,
       AppsRoutingModule,
       SharedModule,
       PickerModule,
       DndModule,
       DragDropModule,
       MatTableModule,
       FlexLayoutModule,
       NgSelectModule,
       NgbTypeaheadModule,
       JobsModule,
       NgxMaskModule.forRoot()

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdvanceUiModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
 }
