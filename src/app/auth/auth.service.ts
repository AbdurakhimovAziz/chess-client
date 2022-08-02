import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { BASE_URL } from '../shared/constants';
import { SigninResponse, SignupResponse } from '../shared/models/auth-response';
import { User } from '../shared/models/user';
import { UsersService } from '../shared/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private model: string = 'auth';

  constructor(private http: HttpClient, private user: UsersService) {}

  public login(email: string, password: string): Observable<SigninResponse> {
    return this.http
      .post<SigninResponse>(this.getUrl('login'), { email, password })
      .pipe(
        tap((res: SigninResponse) => {
          this.saveToken(res.token);
          this.user.setUser(res.user);
        }),
        catchError((err) => throwError(() => err))
      );
  }

  public register(user: Omit<User, '_id'>): Observable<SignupResponse> {
    return this.http
      .post<SignupResponse>(this.getUrl('register'), user)
      .pipe(catchError((err) => throwError(() => err)));
  }

  public isLoggedIn(): boolean {
    return !!this.user.getUser();
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user.setUser(null);
  }

  private saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private getUrl(path: string): string {
    return `${BASE_URL}/${this.model}/${path}`;
  }
}
