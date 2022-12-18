import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private userSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor() {
    const user = localStorage.getItem('user');
    this.userSubject.next(user ? JSON.parse(user) : null);
  }

  public setUser(user: User | null): void {
    user && localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  public getUser(): User | null {
    return this.userSubject.value;
  }

  public getId(): string {
    const user = this.getUser();
    return user ? user._id : '';
  }
}
