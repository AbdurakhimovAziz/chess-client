import { Component, Input, OnInit } from '@angular/core';
import { Board } from 'src/app/shared/models/chess/Board';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @Input() board!: Board;

  constructor() {}

  ngOnInit(): void {
    console.log('board', this.board);
  }
}
