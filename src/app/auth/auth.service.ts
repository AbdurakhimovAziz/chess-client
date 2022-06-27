import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { BASE_URL } from '../shared/constants';
import { User, UserForm } from '../shared/models/user';
import { UsersService } from '../shared/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private user: UsersService) {}

  public login(email: string, password: string): Observable<Object> {
    return this.http.post<User>(this.getUrl('login'), { email, password }).pipe(
      tap((res: User) => {
        this.user.setUser(res);
      }),
      catchError((err) => throwError(() => err))
    );
  }

  public register(user: UserForm): Observable<User> {
    return this.http
      .post<User>(this.getUrl('register'), user)
      .pipe(catchError((err) => throwError(() => err)));
  }

  public isLoggedIn(): boolean {
    return !!this.user.getUser();
  }

  private getUrl(path: string): string {
    return `${BASE_URL}/auth/${path}`;
  }

  public logout(): void {
    this.user.setUser(null);
  }
}
