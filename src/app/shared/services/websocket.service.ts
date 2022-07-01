import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Subject } from 'rxjs';
import { WS_ENDPOINT } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket$: WebSocketSubject<any> = webSocket(WS_ENDPOINT);
  private socket2 = new WebSocket(WS_ENDPOINT);

  private messagesSubject$ = new Subject<string>();
  public messages$ = this.messagesSubject$.asObservable();

  constructor() {}

  public connect() {
    this.socket$.subscribe({
      next: (msg) => {
        console.log('msg', msg);
        this.messagesSubject$.next(msg);
      },
      error: (err) => console.log(err),
      complete: () => console.log('complete'),
    });
  }

  public sendMessage(msg: any) {
    this.socket2.onopen = () => this.socket2.send(msg);
    this.socket$.next(msg);
  }

  public disconnect() {
    this.socket$.complete();
  }
}
