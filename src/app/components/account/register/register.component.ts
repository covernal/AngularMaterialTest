import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';

import { AccountService, AlertService } from '@app/_services';
import { from } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<RegisterComponent>
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f(): any { return this.form.controls; }

  getErrorMessage(): any {
    if (this.f.firstName.hasError('required') || this.f.lastName.hasError('required') ||
    this.f.email.hasError('required') || this.f.password.hasError('required')) {
      return 'You must enter a value';
    }

    if (this.f.email.hasError('email')) {
      return 'Please provide a valid email address';
    }

    if (this.f.password.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    // return this.f.email.hasError('email') ? 'Not a valid email' : '';
  }

    onSubmit(): void {
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.form.invalid) {
          return;
      }

      this.loading = true;
      this.accountService.register(this.form.value)
        .pipe(first())
        .subscribe({
            next: () => {
                this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                this.dialogRef.close();
                this.router.navigate(['/'], { relativeTo: this.route });
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        });
  }
}
