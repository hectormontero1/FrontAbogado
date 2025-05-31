import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../services/auth.service';
import { Environment } from 'devextreme-angular/common/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  token!:string
  private isRefresh = false;
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                return this.handleAuthorizationError(request, next);

            }
            const error = err.error || err.statusText;
            return throwError(error);
        }))
    }
        private setHeaders(request:HttpRequest<any>, token:string){
          return request.clone({
            setHeaders: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }
        private handleAuthorizationError(request:HttpRequest<any>, next:HttpHandler){
          console.log("CALLING HANDLE")
          if(!this.isRefresh){
            this.isRefresh = true;
            return this.authenticationService.Gettoken(environment.user,environment.passwor).pipe(
              switchMap((res)=>{
                this.isRefresh = false;
                this.authenticationService.setAccessToken(res);
    
                return next.handle(this.setHeaders(request, res));
              })
            )
          }else{
            return next.handle(request);
          }
        }
}
