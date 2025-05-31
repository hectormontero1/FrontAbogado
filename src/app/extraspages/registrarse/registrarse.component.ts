import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MonthlyPlan, YearlyPlan, pricingPlan, SimplePlan } from 'src/app/pages/extrapages/pricing/data';
import { MonthlyPlanModel, YearlyPlanModel, PricingModel, SimpleModel } from 'src/app/pages/extrapages/pricing/pricing.model';
import { registro } from './registro.model';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/account/login/toast-service';
import { HttpResponseBase } from '@angular/common/http';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.scss']
})
export class RegistrarseComponent {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  MonthlyPlan!: MonthlyPlanModel[];
  YearlyPlan!: YearlyPlanModel[];
  pricingPlan!: PricingModel[];
  SimplePlan!: SimpleModel[];
  idplan!:number
  signupForm!: UntypedFormGroup;
  submitted = false;
  successmsg = false;
  registro!:registro
  loaded:boolean=false
  error = '';
  // set the current year
  year: number = new Date().getFullYear();
  constructor(private formBuilder: UntypedFormBuilder,private authenticationService: AuthenticationService, private router: Router,
    public toastService: ToastService) { }

  ngOnInit(): void {
     /**
    * BreadCrumb
    */
      this.breadCrumbItems = [
        { label: 'Pages' },
        { label: 'Pricing', active: true }
      ];
      this.signupForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        name: ['', [Validators.required]],
        ruc: ['', Validators.required],
      });

    // Chat Data Get Function
    this._fetchData();
  }
  enviar(number:any){
    registro
    this.loaded=true
    this.idplan=number
    this.router.navigate(['/auth/signup/cover/'+number]);
  }
  onSubmit(){
    this.submitted = true;
  
  }
  get f() { return this.signupForm.controls; }
  // Chat Data Fetch
  private _fetchData() {

    this.authenticationService.Planes()  .subscribe({
      next: (data:any) => {
        this.MonthlyPlan = data;

      },
      error: (error: HttpResponseBase) => {
        this.toastService.show("Usuario o contraseña incorrectos", { classname: 'bg-danger text-white', delay: 15000 });
      }
    });
    this.YearlyPlan = YearlyPlan;
    this.pricingPlan = pricingPlan;
    this.SimplePlan = SimplePlan;
  }
}
