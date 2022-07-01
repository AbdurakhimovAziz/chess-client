import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, tap } from 'rxjs';
import { WebsocketService } from 'src/app/shared/services/websocket.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  constructor(private ws: WebsocketService) {}

  ngOnInit(): void {
    this.ws.connect();
    this.ws.messages$.subscribe((msg) => console.log(msg));
    this.sendMsg();
  }

  closeConnection() {
    this.ws.disconnect();
  }

  sendMsg() {
    const msg1 = JSON.stringify({ event: 'message', data: 'dfdf' });
    const msg2 = JSON.stringify({ event: 'test', data: 'dfdf' });
    this.ws.sendMessage(msg1);
    this.ws.sendMessage(msg2);
  }
}
