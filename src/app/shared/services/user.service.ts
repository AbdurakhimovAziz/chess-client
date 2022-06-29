import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private userSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  public $user: Observable<User | null> = this.userSubject.asObservable();

  public setUser(user: User | null): void {
    localStorage.setItem('user', JSON.stringify(user));
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
