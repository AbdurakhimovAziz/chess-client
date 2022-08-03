import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { UsersService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public user$ = this.userService.user$;
  constructor(
    private userService: UsersService,
    private authService: AuthService
  ) {}

  public logout(): void {
    this.authService.logout();
  }
}
