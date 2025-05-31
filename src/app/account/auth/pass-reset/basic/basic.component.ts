import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/account/login/toast-service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';


@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})

/**
 * Pass-Reset Basic Component
 */
export class BasicComponent implements OnInit {

  // Login Form
  passresetForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();
   private authenticationService = inject(AuthenticationService);
    private loading = inject(LoadingService);
    private router = inject(Router);

    
  constructor(private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    /**
     * Form Validatyion
     */
     this.passresetForm = this.formBuilder.group({
      email: ['', [Validators.required]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.passresetForm.controls; }

  /**
   * Form submit
   */
   onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.passresetForm.invalid) {
      return;
    }else{
       this.submitted = true;
       this.loading.showSpinner2("Enviando Credenciales")
          // Login Api
          this.authenticationService.recuperar(0,this.f['email'].value)  .subscribe({
            next: (user2:any) => {
              this.loading.closeSpinner()

              this.loading.showMensajesuccess("Se evniado la instrucciones a su correo.")
              setTimeout(() => {
                this.router.navigate(['/']);
               }, 1500);
            
            },
            error: (error: HttpErrorResponse) => {
              this.loading.closeSpinner()
              this.loading.showMensajeError(error.message)
            
            }
          });
      
    }
  }

}
