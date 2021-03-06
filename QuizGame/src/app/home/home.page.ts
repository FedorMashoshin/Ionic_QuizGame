import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, Platform, Animation } from '@ionic/angular';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit{

  @ViewChild('menu', {read: ElementRef}) menu: ElementRef;
  @ViewChild('game', {read: ElementRef}) game: ElementRef;
  @ViewChild('score', {read: ElementRef}) score: ElementRef;

  hideMenuAnimation: Animation;
  showGame: Animation;
  showScore: Animation;
  activeView = 'menu';
  categories = [];
  scrollEnabled = false;

  constructor(
    private animateCtrl: AnimationController,
    private platform: Platform,
    private questionService: QuestionService,
    private router: Router
    ) {
      this.questionService.getCategories().subscribe(res => {
        console.log('CATEG: ', res);
        this.categories = res;
      });
    }

  ngAfterViewInit(): void {
    const viewWidth = this.platform.width();

    this.hideMenuAnimation = this.animateCtrl.create('hide-menu')
    .addElement(this.menu.nativeElement)
    .duration(500)
    .easing('ease-out')
    .fromTo('opacity', 1, 0)
    .fromTo('transform', 'translateX(0px)', `translateX(-${viewWidth}px)`);

    this.showGame = this.animateCtrl.create('game')
    .addElement(this.game.nativeElement)
    .duration(500)
    .easing('ease-in')
    .fromTo('opacity', 0, 1)
    .fromTo('transform', `translateX(${viewWidth}px)`, 'translateX(0px)');

    this.showScore = this.animateCtrl.create('score')
    .addElement(this.score.nativeElement)
    .duration(500)
    .easing('ease-in')
    .fromTo('opacity', 0, 1)
    .fromTo('transform', `translateX(${viewWidth}px)`, 'translateX(0px)');
  }

  openCategories(){
    this.hideMenuAnimation.direction('alternate').play();
    this.showGame.direction('alternate').play();
    this.activeView = 'game';
    this.scrollEnabled = true;
  }
  openHighscore(){
    this.hideMenuAnimation.direction('alternate').play();
    this.showScore.direction('alternate').play();
    this.activeView = 'score';
    this.scrollEnabled = true;
  }

  showMenu(){
    this.hideMenuAnimation.direction('reverse').play();
    if (this.activeView === 'game') {
      this.showGame.direction('reverse').play();
    } else {
      this.showScore.direction('reverse').play();
    }
    this.activeView = 'menu';
    this.scrollEnabled = false;
  }

  startGame(category){
    console.log('SELECTED cat: ', category);
    this.router.navigateByUrl(`/game/${category.id}`, {replaceUrl: true});
    this.showMenu();
  }
}
