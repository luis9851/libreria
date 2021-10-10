import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage'
import { finalize } from 'rxjs/operators';
import { FormsModule ,FormGroup, FormBuilder, FormControl, FormArray,Validators } from '@angular/forms';
import { ServiceService } from '../service/service.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  uploadURL: string = "https://www.searchpng.com/wp-content/uploads/2019/03/Upload-Icon-PNG-Image-1024x1024.png";


  num: any = "0%";
  img: boolean = false;
  prog: boolean = false;
  load: boolean = false;
  RegistroFormGrup = this.fb.group({
    title: ['',[Validators.required,Validators.minLength(5)]],
    Editorial: ['',[Validators.required,Validators.minLength(5)]],
    Autor: ['',[Validators.required,Validators.minLength(3)]],
    Clave : ['',[Validators.required,Validators.minLength(8),Validators.maxLength(16)]],
    Precio : ['',[Validators.required,Validators.minLength(8)]],
    disp : ['',[Validators.required,Validators.minLength(8)]],
    ruta : ['',[Validators.required]]
  });

  uploadProgress: number | undefined;


  constructor(private _storage: AngularFireStorage,private _Service: ServiceService,private router: Router,private fb: FormBuilder) { }

  upload(event: any) {
    // Get input file
    this.prog = true;
    
    const file = event.target.files[0];

    // Generate a random ID
    const randomId = Math.random().toString(36).substring(2);
    console.log(randomId);
    const filepath = `images/${randomId}`;

    const fileRef = this._storage.ref(filepath);

    // Upload image
    const task = this._storage.upload(filepath, file);

    // Observe percentage changes
   task.percentageChanges().subscribe((pro) =>{
     this.uploadProgress = pro;
     this.num = this.uploadProgress?.toString() + "%"
    console.log(this.uploadProgress)
   })
  

    // Get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() =>
      { 
        console.log(this.uploadProgress)
        fileRef.getDownloadURL().subscribe((URL) =>{
          this.uploadURL = URL;
          this.prog = false;
          this.img = true;
         
          this.RegistroFormGrup.patchValue({ruta: this.uploadURL})
          console.log(this.uploadURL)
        })
        
       
      }
      )
    ).subscribe();

   
  }

  ngOnInit(): void {
   
  }

  onSubmit(){
    if(this.RegistroFormGrup.valid){
      console.warn(this.RegistroFormGrup.value);
      this.RegistroFormGrup.reset();
      console.log('Exitoso');
    }else if(!this.RegistroFormGrup.valid){
      console.log('Error');
    }
  }

  get form(){return this.RegistroFormGrup.controls}
  get title() {return this.RegistroFormGrup.get('title');}
  get Editorial() {return this.RegistroFormGrup.get('Editorial');}
  get Autor() {return this.RegistroFormGrup.get('Autor');}
  get Clave() {return this.RegistroFormGrup.get('Clave');}
  get Precio() {return this.RegistroFormGrup.get('Precio');}
  get disp() {return this.RegistroFormGrup.get('disp');}
  get ruta() {return this.RegistroFormGrup.get('ruta')}


  AddBook(form: FormGroup){
    this.load = true;
    //console.log(JSON.stringify(this.RegistroFormGrup.value));
    console.log(JSON.stringify(form.value));
    this._Service.putBook(form.value).subscribe(res => {
      console.log(res);
      this.load = false;
      alert('Guardado');
      this.router.navigateByUrl('/home');
    });
  }
  Regresar(){
    this.router.navigateByUrl('/home');
  }
}
