import {
  Component,
  OnInit,
  TemplateRef,
  ElementRef,
  ViewChild
} from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interaction from '@fullcalendar/interaction';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { JobsService } from '@services/jobs.service';
import moment from 'moment';
import { ModalDefaultOptions } from '@utils/utils';
import { LayoutService } from '@services/index';
import { AuthService } from '@services/auth.service';
import { ROLE } from '@constants/roles';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  addModal: BsModalRef;
  editModal: BsModalRef;
  
  jobsPager: any = {
    filter: {},
    currentPage: 1,
    itemsPerPage: 999,
    totalItems: 0,
    totalPages: 0,
  }
  dateFormat = 'MMMM yyyy';
  calendar;
  startDateLabel: Date;
  endDateLabel: Date;
  searchSubscription: any;
  isTesterAdmin: Boolean;

  constructor(
    private modalService: BsModalService,
    private jobsService: JobsService,
    private authService: AuthService,
    private layoutService: LayoutService) {
      this.isTesterAdmin = this.authService.hasRole(ROLE.TESTER_ADMIN);
  }

  changeView(newView) {
    switch (newView) {
      case 'dayGridMonth':
        this.dateFormat = 'MMMM yyyy';
        break;
      case 'dayGridWeek':
      case 'dayGridDay':
        this.dateFormat = 'fullDate';
        break;
    }

    this.calendar.changeView(newView);
    this.changeRange();
  }

  changeRange(direction?: string) {
    if (direction) {
      if (direction === 'next') {
        this.calendar.next()
      } else {
        this.calendar.prev()
      }
    }
    this.getData()
  }

  ngOnInit() {
    this.initCalendar()
    this.modalService.onHidden.subscribe((shouldReload)=>{
      if(shouldReload === 'success'){
        this.getData();
      }
    })
    this.searchSubscription = this.layoutService.searchGetText().subscribe(text => {
      this.jobsPager.q = text;
      this.getData();
    });
  }

  getData() {
    this.startDateLabel = this.calendar.state.dateProfile.currentRange.start;
    this.endDateLabel = new Date(this.calendar.state.dateProfile.currentRange.end.getTime() - 86400000);

    const dates: any = {};
    dates.start = moment(this.startDateLabel).startOf('day').utc().toISOString()
    dates.end = moment(this.endDateLabel).endOf('day').utc().toISOString()

    this.jobsPager.filter.period = [
      { 'job.startDate': dates },
      { 'job.endDate': dates }
    ];

    this.jobsService.list(this.jobsPager).subscribe((resp: any) => {
      if (resp.data) {
        const events = resp.data.map(elem => {
          return {
            extendedProps: {
              job: elem
            },
            title: elem.title,
            start: elem.startDate,
            end: elem.endDate
          }
        });
        this.calendar.batchRendering(() => {
          this.calendar.removeAllEventSources()
          this.calendar.addEventSource(events)
        })
      }
    })
  }

  initCalendar() {
    this.calendar = new Calendar(document.getElementById('calendar'), {
      timeZone: 'locale',
      plugins: [interaction, dayGridPlugin],
      initialView: 'dayGridMonth',
      selectable: true,
      editable: true,
      // events:this.events,
      // get current date on change
      views: {
        month: {
          titleFormat: { month: 'long', year: 'numeric' }
        },
        agendaWeek: {
          titleFormat: { month: 'long', year: 'numeric', day: 'numeric' }
        },
        agendaDay: {
          titleFormat: { month: 'short', year: 'numeric', day: 'numeric' }
        }
      },
      // Add new event
      select: info => {
        if(!this.isTesterAdmin){
          return;
        }
        
        this.modalService.show(AddComponent, ModalDefaultOptions({
          data: {
            dates: {
              startDate: info.start,
              endDate: new Date(info.end.getTime() - 86400000)
            }
          }
        }));
      },
      // Edit calendar event action
      eventClick: ({ event }) => {
          if (!event.extendedProps.job) {
            event.remove();
          } else {
            this.modalService.show(EditComponent, ModalDefaultOptions({ data: event.extendedProps }));
          }
      }
    });
    this.calendar.render();
    this.getData()
  }
}
