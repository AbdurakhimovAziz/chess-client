import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, tap } from 'rxjs';
import { WebsocketService } from 'src/app/shared/services/websocket.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  public messages: string[] = [];

  constructor(public ws: WebsocketService) {}

  ngOnInit(): void {
    this.ws.connect();
    this.ws.messages$.subscribe((msg) => {
      this.messages.push(msg.data);
    });
    this.sendMsg();
  }

  closeConnection() {
    this.ws.disconnect();
  }

  sendMsg() {
    const msg1 = { event: 'message', data: 'some data' };
    const msg2 = { event: 'test', data: 'test' };
    this.ws.sendMessage(msg1);
    this.ws.sendMessage(msg2);
  }
}
