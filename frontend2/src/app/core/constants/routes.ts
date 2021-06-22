import { ROLE } from './roles';

export const ROUTES: any = [
    {
        roles: [ROLE.ADMIN],
        path: './dashboard',
        title: 'Dashboard',
        type: 'link',
        icontype: 'ni-tv-2 text-black',
    },
    {
        roles: [ROLE.ADMIN],
        path: './homepage',
        title: 'Homepage',
        type: 'link',
        icontype: 'fas fa-home text-info',
    },
    {
        roles: [ROLE.ADMIN],
        path: './orders',
        title: 'Orders',
        type: 'link',
        icontype: 'fas fa-truck text-warning',
    },
    // {
    //     roles: [ROLE.ADMIN],
    //     path: './clients',
    //     title: 'Clients',
    //     type: 'link',
    //     icontype: 'ni-badge text-yellow',
    // },
    // {
    //     roles: [ROLE.ADMIN, ROLE.CLIENT, ROLE.TESTER_ADMIN, ROLE.TESTER, ROLE.TESTER_MONITOR],
    //     path: './jobs',
    //     title: 'Jobs',
    //     type: 'link',
    //     icontype: 'ni-briefcase-24 text-info',
    // },
    // {
    //     roles: [ROLE.ADMIN, ROLE.TESTER_ADMIN],
    //     path: './testers',
    //     title: 'Testers',
    //     type: 'link',
    //     icontype: 'ni-ambulance text-red',
    // },
    // {
    //     roles: [ROLE.ADMIN, ROLE.TESTER_ADMIN, ROLE.TESTER, ROLE.TESTER_MONITOR],
    //     path: './devices',
    //     title: 'Devices',
    //     type: 'link',
    //     icontype: 'ni-mobile-button text-green',
    // },
    // {
    //     roles: [ROLE.ADMIN, ROLE.TESTER_ADMIN, ROLE.TESTER, ROLE.TESTER_MONITOR],
    //     path: './samples',
    //     title: 'Samples',
    //     type: 'link',
    //     icontype: 'ni-atom text-blue',
    // },
    // {
    //     roles: [ROLE.ADMIN],
    //     path: './patients',
    //     title: 'Patients',
    //     type: 'link',
    //     icontype: 'ni-single-02 text-red',
    // },
    // {
    //     roles: [ROLE.ADMIN, ROLE.TESTER_ADMIN, ROLE.TESTER, ROLE.TESTER_MONITOR, ROLE.CLIENT],
    //     path: './tests',
    //     title: 'Tests',
    //     type: 'link',
    //     icontype: 'ni-sound-wave text-warning',
    // },
    {
        roles: [ROLE.ADMIN],
        path: './users',
        title: 'Users',
        type: 'link',
        icontype: 'ni-single-02 text-blue',
    },
    {
        roles: [ROLE.ADMIN],
        path: './create-products',
        title: 'Products',
        type: 'link',
        icontype: 'fas fa-plus text-success',
    },
    {
        roles: [ROLE.ADMIN],
        path: './view-products',
        title: 'View products',
        type: 'link',
        icontype: 'fas fa-search text-danger',
    },
    // {
    //     roles: [ROLE.ADMIN],
    //     path: './questions',
    //     title: 'Questions',
    //     type: 'link',
    //     icontype: 'ni-bullet-list-67 text-black',
    // },
    // {
    //     roles: [ROLE.ADMIN],
    //     path: './settings',
    //     title: 'Settings',
    //     type: 'link',
    //     icontype: 'ni-settings-gear-65 text-black',
    // },
];


/*
,
  
    {
        roles: [ROLE.CLIENT],
        path: './reports',
        title: 'Reports',
        type: 'link',
        icontype: 'ni-shop text-primary',
    }
*/