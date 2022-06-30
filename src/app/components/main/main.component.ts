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
    this.ws.sendMessage({ message: 'dfdf' });
  }
}
