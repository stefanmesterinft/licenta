import { Component, Input, OnInit } from "@angular/core";
import { AuthService } from '@services/index';

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit {
  test: Date = new Date();
  dashboard: string;
  @Input() fluid: Boolean;

  constructor(private authService: AuthService) {
    this.dashboard = this.authService.dashboardPath();
  }

  ngOnInit() {}
}
