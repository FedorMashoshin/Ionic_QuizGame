import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  category: string;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    const category = this.route.snapshot.paramMap.get('category');
    this.questionService.getQuestionsForCategory(category).subscribe(res => {
      this.category = res[0].category;
      console.log('CAT:', res);
    });
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
}
