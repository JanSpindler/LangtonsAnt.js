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

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.context = this.canvas.nativeElement
      .getContext('2d') as CanvasRenderingContext2D;
    this.ngZone.runOutsideAngular(() => this.updateGame());
  }

  updateGame() {
    console.log('frame');
    this.drawGrid();
    requestAnimationFrame(() => this.updateGame());
  }
  
  drawGrid() {
    this.context.fillStyle = '#FFFFFF';
    this.context.fillRect(
      0, 
      0, 
      this.canvas.nativeElement.width, 
      this.canvas.nativeElement.height);
  }
}
