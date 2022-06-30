import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, EMPTY, Subject, switchAll, tap } from 'rxjs';
import { WS_ENDPOINT } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket$: WebSocketSubject<any> = webSocket(WS_ENDPOINT);
  private messagesSubject$ = new Subject<string>();
  public messages$ = this.messagesSubject$.asObservable();

  constructor() {}

  public connect() {
    this.socket$.subscribe({
      next: (msg) => this.messagesSubject$.next(msg.data),
      error: (err) => console.log(err),
      complete: () => console.log('complete'),
    });
  }

  public sendMessage(msg: any) {
    this.socket$.next(msg);
  }

  public disconnect() {
    this.socket$.complete();
  }
}
