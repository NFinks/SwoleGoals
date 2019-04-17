import { Router } from '@angular/router';
import { DataService } from './../services/data.service';
import { Component, OnInit, isDevMode } from '@angular/core';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider, LinkedinLoginProvider } from 'ng-dynami-social-login';
import { UserService } from 'src/services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'sg-angular';

  ngOnInit() {
    this.router.navigate(['/app-splash']);
    if (isDevMode()) {
      console.log('👋 Development!');
    } else {
      console.log('💪 Production!');
    }
  }

  constructor(private router : Router, private socialAuthService: AuthService, 
    private userService: UserService) {}

  logOut(){
    DataService.logOut();
    this.userService.logout();
  }

  logIn(socialPlatform : string){
    let socialPlatformProvider;
    if (socialPlatform == "facebook"){
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    }else if(socialPlatform == "google"){
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "linkedin") {
      socialPlatformProvider = LinkedinLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then((loginData) => {
      this.userService.login(loginData).subscribe((response) => {
        if (response != null){
          this.userService.setUserData(response);
          this.userService.setLoggedIn();
          console.log(this.userService.isLoggedIn())
          this.router.navigate(['/app-user-profile']);
        }
      },(error) => {
        console.log('error during post is', error)
      })
    });
  }
}
