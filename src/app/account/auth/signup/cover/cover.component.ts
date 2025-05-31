import { HttpResponseBase } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from 'src/app/account/login/toast-service';
import { User } from 'src/app/core/models/auth.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss']
})

/**
 * Signup Cover Component
 */
export class CoverComponent implements OnInit {

  // Login Form
  SignupForm!: UntypedFormGroup;
  submitted = false;
  // set the current year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;
  fieldTextType!: boolean;
  id!:string
  private currentUserSubject!: BehaviorSubject<User>;
  constructor(private formBuilder: UntypedFormBuilder,private route: ActivatedRoute,private router: Router,private authenticationService: AuthenticationService,public toastService: ToastService) {

    this.id = this.route.snapshot.queryParams['id']!;
    if (this.id == undefined) {
      this.id = this.route.snapshot.paramMap.get('id')!;
    }

   }

  ngOnInit(): void {
    /**
     * Form Validatyion
     */
     this.SignupForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      name: ['', [Validators.required]],
      ruc: ['', Validators.required],
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
  get f() { return this.SignupForm.controls; }

  /**
   * Form submit
   */
   onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.SignupForm.invalid) {
      return;
    }
    this.authenticationService.suscribirse(this.f['name'].value,this.f['email'].value,this.f['ruc'].value,this.id)  .subscribe({
      next: (user:any) => {
if(user=="1"){
  this.toastService.show("Usted tiene cuenta con FenixCode", { classname: 'bg-danger text-white', delay: 15000 });
} 
 this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
 localStorage.removeItem('currentUser');
 localStorage.removeItem('token');
       // this.currentUserSubject.next(null!);
        this.router.navigate(['/auth/login']);
      },
      error: (error: HttpResponseBase) => {
        this.toastService.show("Usuario o contraseña incorrectos", { classname: 'bg-danger text-white', delay: 15000 });
      }
    });


  }

  /**
   * Password Hide/Show
   */
   toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
