import { Colors } from '../Colors';
import { Figure } from './Figure';
import { FigureTypes } from './Figure-types';

export class King extends Figure {
  constructor(color: Colors) {
    super(color);
    this.type = FigureTypes.KING;
    this.color = color;
    this.imgSrc = `./assets/images/figures/king-${color}.png`;
  }
}
