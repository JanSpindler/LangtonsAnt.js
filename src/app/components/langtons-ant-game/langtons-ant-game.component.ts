import { 
  Component, 
  ViewChild, 
  ElementRef, 
  AfterViewInit 
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

  ngAfterViewInit() {
    this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    requestAnimationFrame(updateGame);
  }
}

function updateGame() {
  requestAnimationFrame(updateGame);
  console.log('frame');
}
