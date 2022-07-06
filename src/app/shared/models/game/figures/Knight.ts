import { Colors } from '../Colors';
import { Figure } from './Figure';
import { FigureTypes } from './Figure-types';

export class Knight extends Figure {
  constructor(color: Colors) {
    super(color);
    this.type = FigureTypes.KNIGHT;
    this.color = color;
    this.imgSrc = `./assets/images/figures/knight-${color}.png`;
  }
}
