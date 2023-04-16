import { 
  Component, 
  ViewChild, 
  ElementRef, 
  AfterViewInit,
  NgZone
} from '@angular/core';

@Component({
  selector: 'app-langtons-ant-game',
  templateUrl: './langtons-ant-game.component.html',
  styleUrls: ['./langtons-ant-game.component.css']
})
export class LangtonsAntGameComponent implements AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement> = 
    {} as ElementRef;
  context: CanvasRenderingContext2D = 
    {} as CanvasRenderingContext2D;

  gridWidth: number = 0;
  gridHeight: number = 0;
  pixelPerCell: number = 0;

  currentGridWidth: number = 0;
  currentGridHeight: number = 0;
  currentPixelPerCell: number = 0;

  currentWindowWidth: number = 0;
  currentWindowHeight: number = 0;

  grid: number[][] = new Array<Array<number>>();

  constructor(private ngZone: NgZone) {}

  onStartPressed(): void {
    this.currentGridWidth = this.gridWidth;
    this.currentGridHeight = this.gridHeight;
    this.currentPixelPerCell = this.pixelPerCell;

    this.currentWindowWidth = this.gridWidth * this.pixelPerCell;
    this.currentWindowHeight = this.gridHeight * this.pixelPerCell;

    this.ngZone.runOutsideAngular(() => this.startGame());
  }

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement
      .getContext('2d') as CanvasRenderingContext2D;
    this.ngZone.runOutsideAngular(() => this.startGame());
  }

  startGame(): void {
    console.log('Start game');

    this.stopGame();

    this.grid = new Array<Array<number>>();

    for (let x = 0; x < this.gridWidth; x++) {
      let yArray = new Array<number>();
      for (let y = 0; y < this.gridHeight; y++) {
        yArray.push(0);
      }
      this.grid.push(yArray);
    }

    requestAnimationFrame(() => this.updateGame())
  }

  updateGame(): void {
    console.log('Update game');

    this.drawGrid();
    requestAnimationFrame(() => this.updateGame());
  }
  
  stopGame(): void {
    console.log('Stop game');

    let id = window.requestAnimationFrame(function(){});
    while(id--) {
      window.cancelAnimationFrame(id);
    }
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
        const cellVal = this.grid[x][y];
        switch (cellVal) {
          case 0:
            this.context.fillStyle = '#FFFFFF';
            break;
          case 1:
            this.context.fillStyle = '#000000';
            break;
          case 2:
            this.context.fillStyle = '#FF0000';
            break;
          default:
            console.log('Error: Unkown cell type (' + cellVal + ')')
            break;
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
