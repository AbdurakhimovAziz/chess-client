import { CdkDragEnd } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Cell } from '../../shared/models/game/Cell';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellComponent {
  @Input() cell!: Cell;
  @Output() dragStarted: EventEmitter<void> = new EventEmitter();
  @Output() dragEnded: EventEmitter<CdkDragEnd> = new EventEmitter();
}
