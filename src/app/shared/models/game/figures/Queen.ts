import { Colors } from '../Colors';
import { Figure } from './Figure';
import { FigureTypes } from './Figure-types';

export class Queen extends Figure {
  constructor(color: Colors) {
    super(color);
    this.type = FigureTypes.QUEEN;
    this.color = color;
    this.imgSrc = `./assets/images/figures/queen-${color}.png`;
  }
}
