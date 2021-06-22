'use strict';

export const REFERER: any =  {
    FB:"FB", 
    GOOGLE: "GOOGLE", 
    TRAINER: "TRAINER", 
    COLLEAGUE: "COLLEAGUE", 
    ISJ: "ISJ", 
    MEMBERS: "MEMBERS", 
    EMAIL: "EMAIL"
};


export const REFERER_LABELS: any[] =  [
    { value: REFERER.FB, label: 'Facebook' },
    { value: REFERER.GOOGLE, label: 'Google' },
    { value: REFERER.TRAINER, label: 'Trainer' },
    { value: REFERER.COLLEAGUE, label: 'It was recommended by a colleague' },
    { value: REFERER.ISJ, label: 'County School Inspectorate' },
    { value: REFERER.MEMBERS, label: 'Message to team members' },
    { value: REFERER.EMAIL, label: 'Message received by email' },
];