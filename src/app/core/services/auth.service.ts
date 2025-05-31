import { Injectable } from '@angular/core';
import { getFirebaseBackend } from '../../authUtils';
import { User } from '../models/auth.models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { GlobalComponent } from "../../global-component";
import { registro } from 'src/app/extraspages/registrarse/registro.model';
import { CacheService } from './cache.service';
import { ConfiguracionService } from './configuracion.service';


const RUC = GlobalComponent.RUC;
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  

@Injectable({ providedIn: 'root' })

/**
 * Auth-service Component
 */
export class AuthenticationService {

    user!: User;
    currentUserValue: any;

    public currentUserSubject: BehaviorSubject<User>;
     public texto!: BehaviorSubject<string>;

    constructor(private http: HttpClient,private cacheService: CacheService,private config: ConfiguracionService ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
        this.texto = new BehaviorSubject<string>("rte");
     }

    /**
     * Performs the register
     * @param email email
     * @param password password
     */
    register(email: string, first_name: string, password: string) {        
        // return getFirebaseBackend()!.registerUser(email, password).then((response: any) => {
        //     const user = response;
        //     return user;
        // });

        // Register Api
        return this.http.post(this.config.apiUrl + 'signup', {
            email,
            first_name,
            password,
          }, httpOptions);
    }

    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
    login(usuario: string, password: string) {
const ap=this.config.apiUrl 
        return this.http.post(this.config.apiUrl+"Login/Login?usuario="+usuario+"&clave="+password +"&RUC="+RUC, httpOptions);
    }
    setAccessToken(token:string){
        sessionStorage.setItem("accessToken", token);
      }
      getAccessToken(){
        if(sessionStorage.getItem("accessToken") == null){
          return "";
        }
        return sessionStorage.getItem("accessToken");
      }
    

    Gettoken(user:string,clave:string): Observable<any> {
        const params2 = {
          usuario: 'true',
          clave:'asd'
        }
    
        const header = new HttpHeaders({ 'Content-Type': 'application/json','Accept': 'application/json',
        Authorization: 'Basic ' + btoa(user+ ':' + clave)
    
         });
        // const params = new HttpParams()
        // .append('usu',JSON.stringify(params2))
    
        return this.http.get<any>(this.config.apiUrl+"Auth/Token",{headers:header});
      }
    Verificacion(usuario: string) {

        return this.http.post(this.config.apiUrl+"Login/verificar?value="+usuario, httpOptions);
    }
    recuperarmail(value: string ,txtPassword: string ,PassNueva: string ) {

        return this.http.post(this.config.apiUrl+"Login/CambioRecuperar?value="+value+"&txtPassword="+txtPassword +"&PassNueva="+PassNueva+"&RUC="+RUC, httpOptions);
    }
    Cambiarclave(idusuario: string ,txtPasswordactual: string ,txtPassword: string ,PassNueva: string ) {

        return this.http.post(this.config.apiUrl+"Login/CambioClave?idusuario="+idusuario+"&txtPasswordactual="+txtPasswordactual+"&txtPassword="+txtPassword +"&PassNueva="+PassNueva+"&RUC="+RUC, httpOptions);
    }
    recuperar(WebLoginUsuInterno:number ,NickUsuario: string) {

        return this.http.post(this.config.apiUrl+"Login/Recuperacion?WebLoginUsuInterno="+WebLoginUsuInterno+"&NickUsuario="+NickUsuario+"&RUC="+RUC, httpOptions);
    }
    suscribirse(nombre: string, mail: string, ruc: string,idplan:string) {

        return this.http.post(this.config.apiUrl+"Suscripcion?nombre="+nombre+"&mail="+mail +"&ruc="+ruc+"&idplan="+idplan, httpOptions);
    }
    Planes() {

        return this.http.get(this.config.apiUrl+"Suscripcion/Getplanes", httpOptions);
    }
    /**
     * Returns the current user
     */
    public currentUser(): any {
        return getFirebaseBackend()!.getAuthenticatedUser();
    }

    /**
     * Logout the user
     */
    logout() {
        // logout the user
        // return getFirebaseBackend()!.logout();
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        sessionStorage.removeItem('accessToken');
        this.currentUserSubject.next(null!);

        this.cacheService.cleartodo()
    }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {
        return getFirebaseBackend()!.forgetPassword(email).then((response: any) => {
            const message = response.data;
            return message;
        });
    }

}

