import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, map, Observable, tap } from 'rxjs';
import { WebsocketService } from 'src/app/shared/services/websocket.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  public wsForm = new FormGroup({
    event: new FormControl('', [Validators.required]),
    data: new FormControl('', [Validators.required]),
  });

  public messages: string[] = [];

  constructor(public websocket: WebsocketService) {}

  ngOnInit(): void {
    this.websocket
      .on<string>('message')
      .subscribe((msg) => this.messages.push(msg));

    this.websocket
      .on<string>('test')
      .subscribe((msg) => this.messages.push(msg));
  }

  public closeConnection(): void {
    this.websocket.disconnect();
  }

  public sendMsg(): void {
    this.websocket.send('message', 'some data');
  }

  public onSubmit(): void {
    if (this.wsForm.valid && this.wsForm.value.event) {
      this.websocket.send(this.wsForm.value.event, this.wsForm.value.data);
    }
  }
}
