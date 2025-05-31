import { User } from 'src/app/core/models/auth.models';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ToastService } from '../icons/toast-service';
import * as CryptoJS from 'crypto-js';
import { GlobalComponent } from 'src/app/global-component';
@Component({
  selector: 'app-contrasena',
  templateUrl: './contrasena.component.html',
  styleUrls: ['./contrasena.component.scss']
})
export class ContrasenaComponent implements OnInit{

   // Login Form
   passresetForm!: UntypedFormGroup;
   submitted = false;
   passwordField!: boolean;
   confirmField!: boolean;
   copasswordField!: boolean;
   error = '';
   returnUrl!: string;
   parsedStr!: string;
   compania!: string;
   user!: User;
   // set the current year
   year: number = new Date().getFullYear();
   id!: string;
    private authenticationService = inject(AuthenticationService);
     private loading = inject(LoadingService);
     private router = inject(Router);
   private toastService = inject(  ToastService);
   constructor(private formBuilder: UntypedFormBuilder,private route: ActivatedRoute) {

      //  this.authenticationService.Verificacion(this.parsedStr)  .subscribe({
      //     next: (user2:any) => {
      //      this.compania=user2[4]
      //     },
      //     error: (error: HttpErrorResponse) => {
      //       this.loading.showMensajeError(error.message)
            
             
      //     }
      //   });
    }
 
   ngOnInit(): void {
     /**
      * Form Validatyion
      */
      this.passresetForm = this.formBuilder.group({
       password: ['', [Validators.required]],
       cpassword: ['', [Validators.required]],
       copassword: ['', [Validators.required]]
     });

      // Password Validation set
      var myInput = document.getElementById("password-input") as HTMLInputElement;
      var letter = document.getElementById("pass-lower");
      var capital = document.getElementById("pass-upper");
      var number = document.getElementById("pass-number");
      var length = document.getElementById("pass-length");

      // When the user clicks on the password field, show the message box
      myInput.onfocus = function () {
        let input = document.getElementById("password-contain") as HTMLElement;
        input.style.display = "block"
      };

      // When the user clicks outside of the password field, hide the password-contain box
      myInput.onblur = function () {
        let input = document.getElementById("password-contain") as HTMLElement;
        input.style.display = "none"
      };

      // When the user starts to type something inside the password field
      myInput.onkeyup = function () {
        // Validate lowercase letters
        var lowerCaseLetters = /[a-z]/g;
        if (myInput.value.match(lowerCaseLetters)) {
            letter?.classList.remove("invalid");
            letter?.classList.add("valid");
        } else {
            letter?.classList.remove("valid");
            letter?.classList.add("invalid");
        }

        // Validate capital letters
        var upperCaseLetters = /[A-Z]/g;
        if (myInput.value.match(upperCaseLetters)) {
            capital?.classList.remove("invalid");
            capital?.classList.add("valid");
        } else {
            capital?.classList.remove("valid");
            capital?.classList.add("invalid");
        }

        // Validate numbers
        var numbers = /[0-9]/g;
        if (myInput.value.match(numbers)) {
            number?.classList.remove("invalid");
            number?.classList.add("valid");
        } else {
            number?.classList.remove("valid");
            number?.classList.add("invalid");
        }

        // Validate length
        if (myInput.value.length >= 8) {
            length?.classList.remove("invalid");
            length?.classList.add("valid");
        } else {
            length?.classList.remove("valid");
            length?.classList.add("invalid");
        }
      };

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
         this.user = JSON.parse(
                    localStorage.getItem(GlobalComponent.CURRENT_USER)!
                  );
      let contr=this.f['password'].value
      let contrasenacorreo=this.f['copassword'].value
      let cpassword=this.f['cpassword'].value
      if(contrasenacorreo.includes(this.compania))
        { this.loading.showMensajeError("La contraseña no debe de contener el usuario ")
              return;
        }
        if(contr==contrasenacorreo)
          {this.loading.showMensajeError("La contraseña no debe ser la misma anterior")
                return;
          }
          if(contrasenacorreo!==cpassword)
            {this.loading.showMensajeError("La contraseñas no coinciden")
                  return;
            }
          this.authenticationService.Cambiarclave(this.user.IdUsuario!,this.user.Clave!, contr.toString(),cpassword.toString())  .subscribe({
            next: (user2:any) => {
              this.loading.showMensajesuccess("La contraseñas se actualizo con exito")
              setTimeout(() => {
                this.router.navigate(['/']);
               }, 1500);
            },
            error: (error: HttpErrorResponse) => {
              this.loading.showMensajeError(error.message)
              
               
            }
          });
     }
   }

   /**
   * Password Hide/Show
   */
    togglepasswordField() {
      this.passwordField = !this.passwordField;
    }
    togglecopasswordField() {
      this.copasswordField = !this.copasswordField;
    }
    /**
   * Password Hide/Show
   */
    toggleconfirmField() {
      this.confirmField = !this.confirmField;
    }

}

