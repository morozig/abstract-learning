export enum PlaneSymmetry {
  Vertical,
  Horizontal,
  DiagonalSlash,
  DiagonalBackSlash,
  Rotation90,
  Rotation180,
  Rotation270
}

interface PointTransformOptions {
  i: number;
  j: number;
  height: number;
  width: number;
  sym: PlaneSymmetry;
}

const point = (options: PointTransformOptions) => {
  switch (options.sym) {
    case (PlaneSymmetry.Vertical): {
      return {
        i: options.height - options.i - 1,
        j: options.j
      };
    }
    case (PlaneSymmetry.Horizontal): {
      return {
        i: options.i,
        j: options.width - options.j - 1
      };
    }
    case (PlaneSymmetry.DiagonalSlash): {
      return {
        i: options.height - options.j - 1,
        j: options.height - options.i - 1
      };
    }
    case (PlaneSymmetry.DiagonalBackSlash): {
      return {
        i: options.j,
        j: options.i
      };
    }
    case (PlaneSymmetry.Rotation90): {
      return {
        i: options.j,
        j: options.width - options.i - 1
      };
    }
    case (PlaneSymmetry.Rotation180): {
      return {
        i: options.height - options.i - 1,
        j: options.width - options.j - 1
      };
    }
    case (PlaneSymmetry.Rotation270): {
      return {
        i: options.height - options.j - 1,
        j: options.i
      };
    }
    default: {
      return {
        i: options.i,
        j: options.j
      }
    }
  }
};

const board = (from: number[][], sym: PlaneSymmetry) => {
  const fromHeight = from.length;
  const fromWidth = from[0].length;
  const [ toHeight, toWidth ] = ([
    PlaneSymmetry.Vertical,
    PlaneSymmetry.Horizontal,
    PlaneSymmetry.Rotation180
  ].includes(sym)) ?
    [ fromHeight, fromWidth ] :
    [ fromWidth, fromHeight ];
  const to = [] as number[][];
  for (let i = 0; i < toHeight; i++) {
    to[i] = [];
    for (let j = 0; j< toWidth; j++) {
      to[i][j] = 0;
    }
  }
  for (let i = 0; i < fromHeight; i++) {
    for (let j = 0; j< fromWidth; j++) {
      const toPoint = point({
        i,
        j,
        height: fromHeight,
        width: fromWidth,
        sym
      });
      to[toPoint.i][toPoint.j] = from[i][j];
    }
  }
  return to;
}; 

export {
  point,
  board
};
