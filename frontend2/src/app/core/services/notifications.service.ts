import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toQueryParams } from '@utils/utils';
import { ToastrService } from 'ngx-toastr';
import { isArray } from 'lodash';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class NotificationsService {

  constructor(private toastr: ToastrService, private translate: TranslateService) { }

  format(texts) {
    if (!isArray(texts)) {
      texts = [texts];
    }
    return texts.map(text =>
      `<span translate>${this.translate.instant(text)}</span>`
    ).join("<br/>");
  }

  template(texts, icon?: string, title?: string) {
    texts = this.format(texts);
    return `
      <span class="alert-icon ni ${icon}" data-notify="icon"></span>
      <div class="alert-text">
        <span class="alert-title" data-notify="title">${title}</span>
        <span data-notify="message">${texts}</span>
      </div>
    `;
  }

  showDefault(texts) {
    this.toastr.show(
      this.template(texts, 'ni-bell-55'),
      '',
      {
        toastClass: 'ngx-toastr alert alert-dismissible alert-default alert-notify',
      }
    );
  }
  showError(texts) {
    this.toastr.show(
      this.template(texts, 'ni-fat-remove', 'Error'),
      '',
      {
        toastClass: 'ngx-toastr alert alert-dismissible alert-danger alert-notify',
      }
    );
  }
  showSuccess(texts, extendedTimeOut?:boolean) {
    this.toastr.show(
      this.template(texts, 'ni-check-bold', 'Success'),
      '',
      {
        toastClass: 'ngx-toastr alert alert-dismissible alert-success alert-notify',
        timeOut: extendedTimeOut? 30000 : 5000
      }
    );
  }
  showWarning(texts) {
    this.toastr.show(
      this.template(texts, 'ni-notification-70', 'Warning'),
      '',
      {
        toastClass: 'ngx-toastr alert alert-dismissible alert-warning alert-notify',
      }
    );
  }
  showInfo(texts) {
    this.toastr.show(
      this.template(texts, 'ni-bell-55', 'Info'),
      '',
      {
        toastClass: 'ngx-toastr alert alert-dismissible alert-info alert-notify',
      }
    );
  }
}