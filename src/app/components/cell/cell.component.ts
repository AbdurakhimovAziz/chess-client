import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Cell } from 'src/app/shared/models/game/Cell';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
})
export class CellComponent {
  @Input() cell!: Cell;
  @Output() dragStarted: EventEmitter<void> = new EventEmitter();
  @Output() dragEnded: EventEmitter<CdkDragEnd> = new EventEmitter();
}
