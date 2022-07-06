import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Board } from 'src/app/shared/models/chess/Board';
import { WebsocketService } from 'src/app/shared/services/websocket.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  public board: Board = new Board();

  constructor() {}

  ngOnInit(): void {
    this.restart();
  }

  public restart() {
    this.board = new Board();
    this.board.initCells();
  }
}
