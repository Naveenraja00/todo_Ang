import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    loading = false;
    submitted = false;
    returnUrl!: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
  });

  
  }

  get f() { return this.loginForm.controls; }

  onSubmit(){
    this.submitted = true;


        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        if((this.f.username.value === "naveen") && (this.f.password.value === "Raja")){
          this.router.navigate(['/list']);
          
          
        }else{
          alert("wrong credentials....")
          this.f.username.setValue("")
          this.f.password.setValue("")
        }
        this.loading= false;
  }

}
