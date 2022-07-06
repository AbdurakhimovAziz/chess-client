import { Colors } from '../Colors';
import { Figure } from './Figure';
import { FigureTypes } from './Figure-types';

export class Rook extends Figure {
  constructor(color: Colors) {
    super(color);
    this.type = FigureTypes.ROOK;
    this.color = color;
    this.imgSrc = `./assets/images/figures/rook-${color}.png`;
  }
}
