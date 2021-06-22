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
import { AddJobComponent } from './components/add-job/add-job.component';
import { EditJobComponent } from './components/edit-job/edit-job.component';
import { JobsService } from '@services/jobs.service';
import moment from 'moment';
import { ModalDefaultOptions } from '@utils/utils';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  addModal: BsModalRef;
  editModal: BsModalRef;

  default: ModalOptions = {
    keyboard: true,
    class: 'modal-dialog-centered modal-secondary',
    animated: true,
    backdrop: true,
    ignoreBackdropClick: true,
  };


  dateFormat = "MMMM yyyy";
  calendar;
  startDateLabel: Date;
  endDateLabel: Date;
  constructor(private modalService: BsModalService, private jobsService: JobsService) {
  }

  changeView(newView) {
    switch (newView) {
      case 'dayGridMonth':
        this.dateFormat = "MMMM yyyy";
        break;
      case 'dayGridWeek':
      case 'dayGridDay':
        this.dateFormat = "fullDate";
        break;
    }
    
    this.calendar.changeView(newView);
    this.changeRange();
  }

  changeRange(direction?: string) {
    if(direction){
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
    this.modalService.onHidden.subscribe(data => {
      if(data && data==='success'){
        this.getData();
      }
    })

  }
  getData() {
    this.startDateLabel = this.calendar.state.dateProfile.currentRange.start;
    this.endDateLabel = new Date(this.calendar.state.dateProfile.currentRange.end.getTime() - 86400000) ;

    const dates: any = {};
    dates.start = moment(this.startDateLabel).startOf('day').utc().toISOString()
    dates.end = moment(this.endDateLabel).endOf('day').utc().toISOString()

    this.jobsService.list({
      filters: {
        period: [
          { "job.startDate": dates },
          { "job.endDate": dates }
        ]
      }, 
      itemsPerPage: 999
    }).subscribe((resp: any) => {
      if (resp.data) {
        const events = resp.data.map(elem => {
          return {
            estimatedTests: elem.estimatedTests,
            id: elem.id,
            title: elem.title,
            start: elem.startDate,
            end: elem.endDate
          }
        })
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
        this.modalService.show(AddJobComponent, ModalDefaultOptions({
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
        if (!event.id) {
          event.remove();
        } else {
          this.default.initialState = { job: event } as any;
          this.modalService.show(EditJobComponent, ModalDefaultOptions({data:{ job: event }}));
        }
      }
    });
    this.calendar.render();
    this.getData()
  }
}
