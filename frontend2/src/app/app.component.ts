import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OneSignalService } from './core/services/onesignal.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private router: Router,
    public readonly onesignal: OneSignalService,
    private translate: TranslateService
  ) {
    if(window.innerWidth > 1000){
      document.body.classList.add('g-sidenav-pinned');
    }else{
      document.body.classList.add('g-sidenav-hidden');
    }

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
        window.scrollTo(0, 0);
      }
    });


    //translate.setDefaultLang(environment.fallback_language);
    //translate.use(environment.language)

    if(!environment.disable_one_signal){
      this.onesignal.init();
    }
  }
}
