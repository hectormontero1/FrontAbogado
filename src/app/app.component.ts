import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Globalize from 'globalize';
import 'devextreme/localization/globalize/currency';
import 'devextreme/localization/globalize/date';
import 'devextreme/localization/globalize/message';
import 'devextreme/localization/globalize/number';

import deMessages from 'devextreme/localization/messages/de.json';
import ruMessages from 'devextreme/localization/messages/es.json';

import ruCldrData from 'devextreme-cldr-data/es.json';
import { NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingService } from './core/services/loading.service';
import { ConfiguracionService } from './core/services/configuracion.service';
import { GlobalComponent } from './global-component';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from './core/services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Documentos electrónicos';
  loadingText?:string="Procesando"
  @Output() onComplete = new EventEmitter<void>();
  @Input() init:number = 20;
  private countdownEndRef!: Subscription ;
  formatMessage = Globalize.formatMessage.bind(Globalize);
  bookData$!: Observable<string>;

  constructor(   private titleService: Title, private loading: LoadingService, private router: Router,
  ) {
    this.initGlobalize();
     Globalize.locale("es");
    titleService.setTitle(this.title);
  }

  ngOnInit(): void {
    this.bookData$ = this.loading.getData();
    this.router.events.subscribe((evt: any) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }
  initGlobalize() {
    Globalize.load(
      ruCldrData,
    );
    Globalize.loadMessages(deMessages);
    Globalize.loadMessages(ruMessages);

  }
}
