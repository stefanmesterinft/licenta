import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LayoutService {
    sidebar = false;
    sidebarOpened = false;
    topbar = true;
    breadcrumbs = true;
    search = false;
    footer = true;
    searchSubject = new Subject<string>();

    constructor(){}

    sidebarSet(sidebar){
        setTimeout(() => this.sidebar = sidebar);
        return this.sidebar;
    }

    sidebarToggle(){
        setTimeout(() => this.sidebar = !!this.sidebar);
        return this.sidebar;
    }

    sidebarShow(){
        setTimeout(() => this.sidebar = true);
        return this.sidebar;
    }

    sidebarHide(){
        setTimeout(() => this.sidebar = false);
        return this.sidebar;
    }

    sidebarOpenSet(sidebarOpened){
        setTimeout(() => this.sidebarOpened = sidebarOpened);
        return this.sidebarOpened;
    }

    sidebarOpenToggle(){
        setTimeout(() => this.sidebarOpened = !!this.sidebarOpened);
        return this.sidebarOpened;
    }

    sidebarOpen(){
        setTimeout(() => this.sidebarOpened = true);
        return this.sidebarOpened;
    }

    sidebarClose(){
        setTimeout(() => this.sidebarOpened = false);
        return this.sidebarOpened;
    }

    topbarSet(topbar){
        setTimeout(() => this.topbar = topbar);
        return this.topbar;
    }

    topbarToggle(){
        setTimeout(() => this.topbar = !!this.topbar);
        return this.topbar;
    }

    topbarShow(){
        setTimeout(() => this.topbar = true);
        return this.topbar;
    }

    topbarHide(){
        setTimeout(() => this.topbar = false);
        return this.topbar;
    }

    breadcrumbsSet(breadcrumbs){
        setTimeout(() => this.breadcrumbs = breadcrumbs);
        return this.breadcrumbs;
    }

    breadcrumbsToggle(){
        setTimeout(() => this.breadcrumbs = !!this.breadcrumbs);
        return this.breadcrumbs;
    }

    breadcrumbsShow(){
        setTimeout(() => this.breadcrumbs = true);
        return this.breadcrumbs;
    }

    breadcrumbsHide(){
        setTimeout(() => this.breadcrumbs = false);
        return this.breadcrumbs;
    }

    searchSet(search){
        setTimeout(() => this.search = search);
        return this.search;
    }

    searchToggle(){
        setTimeout(() => this.search = !!this.search);
        return this.search;
    }

    searchShow(){
        setTimeout(() => this.search = true);
        return this.search;
    }

    searchHide(){
        setTimeout(() => this.search = false);
        return this.search;
    }

    searchSetText(text: string) {
        this.searchSubject.next(text);
    }

    searchClear() {
       this.searchSubject.next('');
    }

    searchGetText(): Observable<string> {
        this.searchShow();
        return this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged()
        );
    }

    footerSet(footer){
        setTimeout(() => this.footer = footer);
        return this.footer;
    }

    footerToggle(){
        setTimeout(() => this.footer = !!this.footer);
        return this.footer;
    }

    footerShow(){
        setTimeout(() => this.footer = true);
        return this.footer;
    }

    footerHide(){
        setTimeout(() => this.footer = false);
        return this.footer;
    }
}