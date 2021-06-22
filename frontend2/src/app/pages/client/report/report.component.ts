import { Component, OnInit } from '@angular/core';
import { TestsService, AuthService } from '@services/index';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
declare var bwipjs: any;
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  total: any;
  p: any;
  loading: boolean;
  tests$: Observable<any>;
  testsPager: any = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  };
  constructor(private testsService: TestsService, private authService: AuthService) { }

  ngOnInit() {
    this.pageChanged();
  }

  pageChanged(page: number = 1) {
    this.testsPager.currentPage = page;
    this.tests$ = this.testsService.list(this.testsPager).pipe(
      tap((res: any) => { this.testsPager = res.meta }),
      map(res => res.data)
    );
  }

  trackById(index, item ) {
    return item.id;
  }

  hasRole(role: string) {
    this.authService.hasRole(role);
  }

  renderBarcode(item) {
    if(item.barcode){
      return item.barcode;
    }

    try {
      // The return value is the canvas element
      let canvas = document.createElement('canvas');
      bwipjs.toCanvas(canvas, {
        bcid: 'azteccode',   
        text: item.code,  
        scale: 1 ,            
        width: 20,
        height: 20
      });
      item.barcode = canvas.toDataURL('image/png');
    } catch (e) {
      item.barcode = '';
    }

    return  item.barcode;
  }
}
