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

  currentAntX: number = 0;
  currentAntY: number = 0;

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

    this.currentAntX = Math.floor(this.gridWidth / 2);
    this.currentAntY = Math.floor(this.gridHeight / 2);

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
      setTimeout(() => this.unpausedUpdateGame(), 1000);
      return;
    }
    requestAnimationFrame(() => this.updateGame());
  }
  
  unpausedUpdateGame(): void {
    this.stepGame();
    requestAnimationFrame(() => this.updateGame());
  }

  stepGame(): void {
    console.log('Step game');

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
        if (x === this.currentAntX && y === this.currentAntY) {
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
