import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { User } from './_models';
import { AccountService } from './_services';
import { LoginComponent } from '@app/components/account/login/login.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-app';
  user: User;

  constructor(
    private accountService: AccountService,
    public dialog: MatDialog
    ) {
    this.accountService.user.subscribe(x => this.user = x);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  logout(): void{
    this.accountService.logout();
}
}
