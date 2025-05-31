import { Component, inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Login Auth
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { first } from 'rxjs/operators';
import { ToastService } from './toast-service';
import { HttpErrorResponse, HttpResponseBase } from '@angular/common/http';
import { GlobalComponent } from 'src/app/global-component';
import { User } from 'src/app/core/models/auth.models';
import { EventService } from 'src/app/core/services/event.service';
import { CacheService } from 'src/app/core/services/cache.service';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {

  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  user!:User
  toast!: false;

  // set the current year
  year: number = new Date().getFullYear();
 private loading = inject(LoadingService);
  constructor(private formBuilder: UntypedFormBuilder,private authenticationService: AuthenticationService,private router: Router,
    private cacheService: CacheService,private eventService: EventService,private authFackservice: AuthfakeauthenticationService,private route: ActivatedRoute,public toastService: ToastService) {
      // redirect to home if already logged in
      if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/']);
     }
     }

  ngOnInit(): void {
    if(localStorage.getItem('currentUser')) {
      this.router.navigate(['/']);
    }
    /**
     * Form Validatyion
     */
     this.loginForm = this.formBuilder.group({
    // ruc: ['', [Validators.required]],
      password: ['', [Validators.required]],
      usuario: ['', [Validators.required]],
    });
    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  reset()
   {

    
    this.router.navigate(['/auth/pass-reset/basic']);
   }

  /**
   * Form submit
   */
   onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }else{
 this.loading.showSpinner2("Enviando Credenciales")
    // Login Api
    this.authenticationService.login(this.f['usuario'].value,this.f['password'].value)  
    .subscribe({
      next: (user2:any) => {
       if(user2 != null){
        this.user= new User
        this.user=user2
       this.user.password=this.f['password'].value
      
       localStorage.setItem('toast', 'true');
       localStorage.setItem(GlobalComponent.CURRENT_USER, JSON.stringify(this.user));
       this.loading.closeSpinner()
      this.router.navigate(['/']);
       } 
      },
      error: (error: HttpErrorResponse) => {
        this.loading.closeSpinner()
        this.user= new User
         localStorage.setItem('toast', 'true');
       localStorage.setItem(GlobalComponent.CURRENT_USER, JSON.stringify(this.user));
       this.router.navigate(['/']);
        this.toastService.show(error.message, { classname: 'bg-danger text-white', delay: 2500 });
      }
    });

  }
     
     
  }

  /**
   * Password Hide/Show
   */
   toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
