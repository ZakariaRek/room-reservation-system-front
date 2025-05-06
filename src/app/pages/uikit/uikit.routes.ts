import { Routes } from '@angular/router';

import { FormLayoutDemo } from './formlayoutdemo';
// import { ListDemo } from './listdemo';
import { MessagesDemo } from './messagesdemo';
import { MiscDemo } from './miscdemo';
import { PanelsDemo } from './panelsdemo';
import { TimelineDemo } from './timelinedemo';

import { MenuDemo } from './menudemo';

export default [
   
    { path: 'formlayout', data: { breadcrumb: 'Form Layout' }, component: FormLayoutDemo },
    // { path: 'list', data: { breadcrumb: 'List' }, component: ListDemo },
    { path: 'message', data: { breadcrumb: 'Message' }, component: MessagesDemo },
    { path: 'misc', data: { breadcrumb: 'Misc' }, component: MiscDemo },
    { path: 'panel', data: { breadcrumb: 'Panel' }, component: PanelsDemo },
    { path: 'timeline', data: { breadcrumb: 'Timeline' }, component: TimelineDemo },
    { path: 'menu', data: { breadcrumb: 'Menu' }, component: MenuDemo },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
