import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'angular-feather/icons';
import * as CryptoJS from 'crypto-js';
import { ToastService } from 'src/app/account/login/toast-service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { GlobalComponent } from 'src/app/global-component';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})

/**
 * Basic Component
 */
export class BasicComponent implements OnInit {

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
   // set the current year
   year: number = new Date().getFullYear();
   id!: string;
    private authenticationService = inject(AuthenticationService);
     private loading = inject(LoadingService);
     private router = inject(Router);
   private toastService = inject(  ToastService);
   constructor(private formBuilder: UntypedFormBuilder,private route: ActivatedRoute) {
    this.id = this.route.snapshot.queryParams['id']!;
    if (this.id == undefined) {
      this.id = this.route.snapshot.paramMap.get('id')!;
    }
    var parsedWordArray = CryptoJS.enc.Base64.parse(this.id);
     this.parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
       this.authenticationService.Verificacion(this.parsedStr)  .subscribe({
          next: (user2:any) => {
           this.compania=user2[4]
          },
          error: (error: HttpErrorResponse) => {
            this.loading.showMensajeError(error.message)
            
             
          }
        });
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
      let contr=this.f['password'].value
      let contrasenacorreo=this.f['copassword'].value
      let cpassword=this.f['cpassword'].value
      if(contr.includes(this.compania))
        { this.loading.showMensajeError("La contraseña no debe de contener el usuario ")
              return;
        }
        if(contr==contrasenacorreo)
          {this.loading.showMensajeError("La contraseña no debe ser la misma que la enviada en correo")
                return;
          }
          if(contr!==cpassword)
            {this.loading.showMensajeError("La contraseñas no coinciden")
                  return;
            }
          this.authenticationService.recuperarmail(this.parsedStr,contrasenacorreo.toString(),contr.toString())  .subscribe({
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
