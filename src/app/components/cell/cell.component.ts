import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cell } from 'src/app/shared/models/game/Cell';
import { Figure } from 'src/app/shared/models/game/figures/Figure';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
})
export class CellComponent implements OnInit {
  @Input() cell!: Cell;
  @Output() dragStarted: EventEmitter<void> = new EventEmitter();
  @Output() dragEnded: EventEmitter<CdkDragEnd> =
    new EventEmitter<CdkDragEnd>();

  constructor() {}

  ngOnInit(): void {}
}
