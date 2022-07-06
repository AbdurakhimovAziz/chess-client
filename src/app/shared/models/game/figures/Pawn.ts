import { Colors } from '../Colors';
import { Figure } from './Figure';
import { FigureTypes } from './Figure-types';
// import a from '../../../../../assets'

export class Pawn extends Figure {
  constructor(color: Colors) {
    super(color);
    this.type = FigureTypes.PAWN;
    this.color = color;
    this.imgSrc = `./assets/images/figures/pawn-${color}.png`;
  }
}
