import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import {
  AuthService,
  OrderService,
  NotificationsService,
  UsersService,
} from '@services/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddOrderComponent } from './add/add.component';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, map, filter } from 'rxjs/operators';
import { LayoutService } from '@services/layout.service';
import { Observable } from 'rxjs';
import { ModalDefaultOptions, typeaheadDefaultObservable } from '@utils/utils';
import moment from 'moment';
import { ROLE } from '../../../core/constants/roles';
import { EditOrderComponent } from './edit/edit.component';
import { STATUS_LABELS } from '@constants/status-type';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class MyOrdersComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('filtersForm') filtersForm;
  filters: any = {
    orderStatus: ''
  };


  orderStatuses = STATUS_LABELS;

  selected: any = {};
  users$: Observable<any>;

  orders$: Observable<any>;
  ordersPager: any = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    inited: false,
  };
  searchSubscription: any;

  constructor(
    private ordersService: OrderService,
    private modalService: BsModalService,
    public authService: AuthService,
    private layoutService: LayoutService,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit() {
    this.pageChanged();

    this.getTypeaheadData();
  }


  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.filtersForm.form.valueChanges.subscribe((filters) =>
      this.filterChanged(filters),
    );
  }

  pageChanged(page: number = 1) {
    this.ordersPager.currentPage = page;
    this.orders$ = this.ordersService.listMy(this.ordersPager).pipe(
      tap((res: any) => {
        this.ordersPager = {
          ...this.ordersPager,
          ...res.meta,
          inited: true,
        };        
      }),
      map((res) => res.data),
    );
  }

  getTypeaheadData() {
    this.users$ = typeaheadDefaultObservable(
      this.selected,
      'user',
      this.usersService,
      'listUsersTypeahead',
    );

  }

  editOrder(order) {
    this.modalService.show(
      EditOrderComponent,
      ModalDefaultOptions({
        data: { order },
      }),
    );
  }

  viewOrder(order){
    this.router.navigate(['/user/my-orders/',order.id])
  }

  clearIfEmpty(field) {
    const value = this.selected[field];

    if ((value === undefined || value === '') && this.filters[field]) {
      delete this.filters[field];
      this.filterChanged(this.filters);
    }
  }

  selectMatch(name, event) {
    this.filters[name] = event.item?.id || event.target?.value;
    this.filterChanged(this.filters);
  }

  filterChanged(filters) {
    this.ordersPager.filter = {};

    /* Add here your filters */
    if (filters.orderStatus) {
      this.ordersPager.filter['order.orderStatus'] = filters.orderStatus;
    }
    
    if (filters.startDate || filters.endDate) {
      const dates: any = {};
      if (filters.startDate) {
        dates.start = moment(filters.startDate)
          .startOf('day')
          .utc()
          .toISOString();
      }

      if (filters.endDate) {
        dates.end = moment(filters.endDate).endOf('day').utc().toISOString();
      }

      this.ordersPager.filter['order.createdAt'] = dates;
    }
    if (Object.keys(filters).length && this.ordersPager.inited) {
      this.pageChanged();
    }
  }
}