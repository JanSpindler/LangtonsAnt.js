import { 
  Component, 
  ViewChild, 
  ElementRef, 
  AfterViewInit,
  NgZone
} from '@angular/core';

interface GridType {
  name: string
}

enum Direction {
  Up = 0,
  Left = 1,
  Down = 2,
  Right = 3,
}

function modulo(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function rotateDirCw(dir: Direction): Direction {
  const newDir: Direction = modulo(dir - 1, 4);
  //console.log('New direction: ' + newDir);
  return newDir;
}

function rotateDirCcw(dir: Direction): Direction {
  const newDir: Direction = modulo(dir + 1, 4);
  //console.log('New direction: ' + newDir);
  return newDir;
}

@Component({
  selector: 'app-langtons-ant-game',
  templateUrl: './langtons-ant-game.component.html',
  styleUrls: ['./langtons-ant-game.component.css']
})
export class LangtonsAntGameComponent implements AfterViewInit {
  gridTypes: GridType[] = [
    { name: 'empty' },
    { name: 'fill' },
    { name: 'checkerboard' },
    { name: 'inverted checkerboard' }
  ];

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement> = {} as ElementRef;
  context: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;

  @ViewChild('stepCounterText') stepCounterText: ElementRef<HTMLParagraphElement> = {} as ElementRef;

  gameStatus: string = 'undefined';
  pauseAfterStep: boolean = true;
  stepCounter: number = 0;

  gridWidth: number = 21;
  gridHeight: number = 21;
  pixelPerCell: number = 15;
  gridType: GridType = this.gridTypes[0];

  currentGridWidth: number = 0;
  currentGridHeight: number = 0;
  currentPixelPerCell: number = 0;
  currentGridType: GridType = this.gridTypes[0];

  currentWindowWidth: number = 0;
  currentWindowHeight: number = 0;

  antX: number = 0;
  antY: number = 0;
  antDir: Direction = Direction.Up;

  grid: number[][] = new Array<Array<number>>();

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
  }

  setStepCounter(stepCounter: number): void {
    this.stepCounter = stepCounter;
    this.stepCounterText.nativeElement.innerText = 'Step counter: ' + stepCounter;
  }

  incStepCounter(): void {
    this.setStepCounter(this.stepCounter + 1);
  }

  onStartPressed(): void {
    this.currentGridWidth = this.gridWidth;
    this.currentGridHeight = this.gridHeight;
    this.currentPixelPerCell = this.pixelPerCell;
    this.currentGridType = this.gridType;

    this.currentWindowWidth = this.gridWidth * this.pixelPerCell;
    this.currentWindowHeight = this.gridHeight * this.pixelPerCell;

    this.canvas.nativeElement.width = this.currentWindowWidth;
    this.canvas.nativeElement.height = this.currentWindowHeight;

    this.ngZone.runOutsideAngular(() => this.startGame());
  }

  onTogglePausePressed(): void {
    this.pauseAfterStep = !this.pauseAfterStep;
  }

  onResetPressed(): void {
    this.ngZone.runOutsideAngular(() => this.startGame());
  }

  onStepPressed(): void {
    this.stepGame();
  }

  startGame(): void {
    console.log('Start game');

    this.antX = Math.floor(this.currentGridWidth / 2);
    this.antY = Math.floor(this.currentGridHeight / 2);
    this.antDir = Direction.Up;

    this.stopGame();
    this.setStepCounter(0);

    this.grid = new Array<Array<number>>();

    for (let x = 0; x < this.gridWidth; x++) {
      let yArray = new Array<number>();
      
      for (let y = 0; y < this.gridHeight; y++) {
        let cellVal: number = 0;
        const gridType: string = this.currentGridType.name;

        if (gridType === 'empty') {
          cellVal = 0;
        } else if (gridType === 'fill') {
          cellVal = 1;
        } else if (gridType === 'checkerboard') {
          cellVal = (x + y) % 2 === 0 ? 0 : 1;
        } else if (gridType === 'inverted checkerboard') {
          cellVal = (x + y) % 2 === 1 ? 0 : 1;
        }

        yArray.push(cellVal);
      }
      
      this.grid.push(yArray);
    }

    requestAnimationFrame(() => this.updateGame())
  }

  updateGame(): void {
    //console.log('Update game');

    this.drawGrid();
    if (!this.pauseAfterStep) {
      setTimeout(() => this.unpausedUpdateGame(), 0);
      return;
    }
    requestAnimationFrame(() => this.updateGame());
  }
  
  unpausedUpdateGame(): void {
    this.stepGame();
    requestAnimationFrame(() => this.updateGame());
  }

  stepGame(): void {
    //console.log('Step game');

    // Scan current cell
    const cellVal: number = this.grid[this.antX][this.antY];

    // Rotate and flip
    if (cellVal === 0) {
      this.antDir = rotateDirCw(this.antDir);
      this.grid[this.antX][this.antY] = 1;
    } else if (cellVal === 1) {
      this.antDir = rotateDirCcw(this.antDir);
      this.grid[this.antX][this.antY] = 0;
    } else {
      console.log('Error: invalid cell value ' + cellVal);
    }

    // Store old ant position
    const oldAntX: number = this.antX;
    const oldAntY: number = this.antY;

    // Move
    switch (this.antDir) {
      case Direction.Up:
        this.antY--;
        break;
      case Direction.Left:
        this.antX--;
        break;
      case Direction.Down:
        this.antY++;
        break;
      case Direction.Right:
        this.antX++;
        break;
      default:
        console.log('Error: unknown ant direction' + this.antDir);
        break;
    }

    // Check if ant left the grid
    if (
      this.antX < 0 
      || this.antY < 0 
      || this.antX >= this.currentGridWidth 
      || this.antY >= this.currentGridHeight
      ) {
        this.pauseAfterStep = true;
        this.antX = oldAntX;
        this.antY = oldAntY;
    }

    // Update gui
    this.incStepCounter();
  }

  stopGame(): void {
    console.log('Stop game');

    let id = window.requestAnimationFrame(function(){});
    while(id--) {
      window.cancelAnimationFrame(id);
    }

    this.gameStatus = 'stopped'
  }

  drawGrid(): void {
    this.context.fillStyle = '#FFFFFF';
    this.context.fillRect(
      0, 
      0, 
      this.currentWindowWidth, 
      this.currentWindowHeight
    );

    for (let x = 0; x < this.currentGridWidth; x++) {
      for (let y = 0; y < this.currentGridHeight; y++) {
        if (x === this.antX && y === this.antY) {
          this.context.fillStyle = '#FF0000';
        } else if (this.grid[x][y] === 0) {
          this.context.fillStyle = '#FFFFFF';
        } else if (this.grid[x][y] === 1) {
          this.context.fillStyle = '#000000';
        }

        this.context.fillRect(
          this.currentPixelPerCell * x,
          this.currentPixelPerCell * y,
          this.currentPixelPerCell,
          this.currentPixelPerCell,
        );
      }
    }
  }
}
