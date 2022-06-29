import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  public hide: Boolean = true;
  public errorMsg: string = '';

  public registerForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private auth: AuthService,
    private router: Router
  ) // private _snackBar: MatSnackBar
  {}

  register(): void {
    this.auth.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
        // this._snackBar.open('User registered successfully', 'x', {
        //   duration: 3000,
        //   panelClass: ['success'],
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        // });
      },
      error: (e) => {
        console.log(e);
        this.errorMsg = e.error.message;
      },
    });
  }

  public get email(): AbstractControl | null {
    return this.registerForm.get('email');
  }

  public get password(): AbstractControl | null {
    return this.registerForm.get('password');
  }
}
