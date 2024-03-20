import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage implements OnInit {

  public user: User | null = null;

  public constructor(
    private readonly authService: AuthService
  ) { }

  public ngOnInit(): void {
    this.authService.getSession('user')
      .then(userJson => {
        if (userJson) {
          this.user = JSON.parse(userJson) as User;
        }
      });
  }

  public handleLogout() {
    this.authService.closeSession();
  }
}
