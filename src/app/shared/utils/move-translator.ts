import { Point } from '../models/game/Point';

export const pointToCoordinates = (sourcePoint: Point, destPoint: Point) => {
  const incrementX = 97;
  return (
    String.fromCharCode(sourcePoint.x + incrementX) +
    (Math.abs(sourcePoint.y - 7) + 1) +
    ' - ' +
    String.fromCharCode(destPoint.x + incrementX) +
    (Math.abs(destPoint.y - 7) + 1)
  );
};
