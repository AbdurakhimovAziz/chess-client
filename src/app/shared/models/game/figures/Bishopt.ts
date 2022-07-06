import { Colors } from '../Colors';
import { Figure } from './Figure';
import { FigureTypes } from './Figure-types';

export class Bishop extends Figure {
  constructor(color: Colors) {
    super(color);
    this.type = FigureTypes.BISHOP;
    this.color = color;
    this.imgSrc = `./assets/images/figures/bishop-${color}.png`;
  }
}
