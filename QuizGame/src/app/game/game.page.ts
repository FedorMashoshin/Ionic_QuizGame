import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonSlides } from '@ionic/angular';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  @ViewChild('mySlider')  slides: IonSlides;
  category: string;
  questions: any[] = [];
  done = 0;

  slideOptions: any;
  slider;
  points: number;


  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private alertController: AlertController,
    private router: Router
  ) {
  }

  ngOnInit() {
    const category = this.route.snapshot.paramMap.get('category');
    this.questionService.getQuestionsForCategory(category).subscribe(res => {
      this.category = res[0].category;
      this.questions =  res;
      console.log('CAT:', res);
    });

  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad ServicePage');
    setTimeout(() => this.slides.lockSwipes(true), 500);
  }

  async endGame(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure you want to end current game?',
      message: 'Your progress will be lost.',
      buttons: [
        {
          text: 'End game',
          cssClass: 'secondary',
          handler: () => {
            this.router.navigateByUrl('/',  { replaceUrl: true });
          }
        }, {
          text: 'Continue',
          role: 'cancel',
        }
      ]
    });
    await alert.present();
  };

  selectAnswer(q, a){
    if (q.correct_answer === a) {
      this.points += 10;
    } else {}
    this.done += 1 ;
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }
}
