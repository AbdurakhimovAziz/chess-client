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
    this.ws.sendMessage({ message: 'dfdf' });
    this.ws.sendMessage(JSON.stringify({ event: 'message', data: 'dfdf' }));
    this.ws.sendMessage(JSON.stringify({ event: 'message', data: 'dfdf' }));
    // this.ws.sendMessage({ message: 'dfdf' });
    // this.ws.sendMessage({ message: 'dfdf' });
  }
}
