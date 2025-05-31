import { Injectable } from "@angular/core";
import { Direction, Position } from "devextreme/common";
import { NgxSpinnerService } from "ngx-spinner";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import notify from "devextreme/ui/notify";
import hideToasts from "devextreme/ui/toast/hide_toasts";
import { DevExtremeModule } from "devextreme-angular";
import Swal from "sweetalert2";
@Injectable({
  providedIn: "root",
})
export class LoadingService {
  types: string[] = ["error", "info", "success", "warning"];
  positions: string[] = [
    "top left",
    "top center",
    "top right",
    "bottom left",
    "bottom center",
    "bottom right",
    "left center",
    "center",
    "right center",
  ];

  private loadingMessageTimeoutId: any;
  public loadingText: string = "Loading...";
  messageService: any;
  private countdownEndSource = new Subject<void>();
  public countdownEnd$ = this.countdownEndSource.asObservable();
  searchData$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  constructor(private spinner: NgxSpinnerService) {}
  sendData(term: any) {
    this.searchData$.next(term);
  }
  getData() {
    return this.searchData$.asObservable();
  }
  showMensajeError(mensaje: string) {
    notify({
      message: mensaje,
      height: 45,
      width: 400,
      minWidth: 150,
      type: "error",
      displayTime: 5000,
      animation: {
        show: {
          type: "fade",
          duration: 400,
          from: 0,
          to: 1,
        },
        hide: { type: "fade", duration: 40, to: 0 },
      },
      position: "top right",
      direction: "up-push",
    });
  }
  isPredefined = true;
  direction = "up-push";
  predefinedPosition = "bottom center";
  coordinatePosition = {
    top: undefined,
    bottom: undefined,
    left: undefined,
    right: undefined,
  };
  show() {
    const position = this.isPredefined
      ? this.predefinedPosition
      : this.coordinatePosition;
    const direction = this.direction;
  }
  showMensajewarning(mensaje: string) {
    notify({
      message: mensaje,
      height: 
      
      45,
      width: 400,
      minWidth: 150,
      type: "warning",
      displayTime: 3500,
      animation: {
        show: {
          type: "fade",
          duration: 400,
          from: 0,
          to: 1,
        },
        hide: { type: "fade", duration: 40, to: 0 },
      },
      position: "top right",
      direction: "up-push",
    });
  }
  showMensajesuccess(mensaje: string) {
    notify({
      message: mensaje,
      height: 45,
      width: 300,
      minWidth: 150,
      type: "success",
      displayTime: 3500,
      animation: {
        show: {
          type: "fade",
          duration: 400,
          from: 0,
          to: 1,
        },
        hide: { type: "fade", duration: 40, to: 0 },
      },
      position: "top right",
      direction: "up-push",
    });
  }

  showSpinner2(mensaje: string) {
    this.sendData(mensaje);
    this.spinner.show(undefined, {
      type: "ball-scale-multiple",
      size: "medium",

      bdColor: "rgba(0, 0, 0, 0.8)",
      color: "white",
      fullScreen: true,
    });
  }

  closeSpinner() {
    this.spinner.hide();
  }
  showSpinnertimer(tiempo: number) {
    this.spinner.show(undefined, {
      type: "ball-scale-multiple",
      fullScreen: true,
    });
    setTimeout(() => {
      this.spinner.hide();
    }, tiempo);
  }
  changeOptions() {
    this.spinner.show(undefined, {
      type: "square-spin",
      size: "medium",
      bdColor: "rgba(100,149,237, .8)",
      color: "white",
      fullScreen: false,
    });
    setTimeout(() => this.spinner.hide(), 5000);
  }
  showPopupWithHtl(html: string) {
    Swal.fire({
      title: "<strong>HTML <u>example</u></strong>",
      icon: "info",
      html:html,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: `
        <i class="fa fa-thumbs-up"></i> Great!
      `,
      confirmButtonAriaLabel: "Thumbs up, great!",
      cancelButtonText: `
        <i class="fa fa-thumbs-down"></i>
      `,
      cancelButtonAriaLabel: "Thumbs down"
    });
  }


}
