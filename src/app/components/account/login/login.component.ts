import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { AccountService, AlertService } from '@app/_services';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<LoginComponent>
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RegisterComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  // convenience getter for easy access to form fields
  get f(): any { return this.form.controls; }

  getErrorMessage(): any {
    if (this.f.email.hasError('required') || this.f.password.hasError('required')) {
      return 'You must enter a value';
    }

    return this.f.email.hasError('email') ? 'Not a valid email' : '';
  }
  onSubmit(): any {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.accountService.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: () => {
            // get return url from query parameters or default to home page
            /* tslint:disable:no-string-literal */
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
            this.dialogRef.close();
            this.router.navigateByUrl(returnUrl);
        },
        error: error => {
            this.alertService.error(error);
            this.loading = false;
        }
      });
  }
}
