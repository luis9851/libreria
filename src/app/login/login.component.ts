import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ServiceService } from '../service/service.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  
  dato: any;
  CustomerForm: FormGroup;
  private email: string | undefined;
  private pass: string | undefined;
  public iconUser: boolean = true;
  public iconPass: boolean = true;
  public load: boolean = false;
  public alert: boolean = false;
  public NoUser: boolean = false;
  public Forbidden: boolean = false;
  


  constructor(private fb: FormBuilder,private router: Router, private server: ServiceService) {

    this.CustomerForm = this.fb.group({
      email: new FormControl("",{validators: Validators.required, updateOn:'blur'}),
      pass: new FormControl("",{validators: Validators.required, updateOn:'blur'}),
    }),{updateOn:'change'}
   }

  ngOnInit(): void {
  }


  Check_Des(email: string, pass: string){
    this.asyncCall(email, pass);
    this.load = true;
   }

   async asyncCall(email:string, pass:string) {
    
     var ciphertext = await pass
     const result = await this.resolve(email, ciphertext);
     // expected output: 'resolved'
   }

    resolve(email: string, pass: any) {
   
      
      
     this.CustomerForm.get('email')?.setValue(email);
     this.CustomerForm.get('pass')?.setValue(pass);
     return new Promise(resolve => {
       setTimeout(() => {
         resolve(
             this.server.auth(this.CustomerForm.value).subscribe(res =>{
                      console.log(res)
                      this.load = false;
                      if(res == undefined){
                            console.log("Revisa conexion a internet")
                      }

                      if(res['status'] == "none"){
                        this.alert=true;
                        this.NoUser=true;
                        this.Forbidden=false;
                        this.NoShow();
                        console.log("No existe ese usuario")
                          
                      }
                       if(res['status'] == 403){

                        this.alert=true;
                        this.NoUser=false;
                        this.Forbidden=true;
                        console.log("Correo o contraseña incorrecto(s)")   
                        this.NoShow();         
                        //this.fail=true;

                      }
                      if (res['status'] == 200) {
                      
                        this.process(res);
                       // this.router.navigateByUrl('/home');
                      }

                          // this.load=false;

             },(err)=>{
                   console.log("Revisa conexion a internet")
             })
           
          );
       }, 700);
     });
   }


   hiddenU(){
     this.iconUser = false;
   }
  
   hiddenP(){
    this.iconPass = false;
  }

  NoShow(){
    setTimeout(()=>{
      this.alert=false;
      this.NoUser=false;
      this.Forbidden=false;
    },1500)
  }
    
  async process (res: any){

    await localStorage.setItem('T_ac', res.accessToken);

    await localStorage.setItem('_identity',res._identity)

    /*await this.server.ModiSession(true)

    await this.server.setUser(res.name)*/

    await this.redirect(res.arranque);

  }


  redirect(Arranque: any){


    if(Arranque == true){

      this.router.navigateByUrl('/Bienvenida')


    }else{

      this.router.navigateByUrl('/home')

    }

    /* return new Promise(resolve => {

      setTimeout(() => {

        resolve(     

          this.router.navigateByUrl('/home')

         );

      }, 2000);

    }); */



  }

}
