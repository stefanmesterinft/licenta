'use strict';

export const STATUS: any =  {
    PLACED: 'PLACED',
    CONFIRMED: 'CONFIRMED',
    SENT: 'SENT',
    DELIVERED: 'DELIVERED',
    CANCELED: 'CANCELED'
}



export const STATUS_LABELS: any[] =  [
    { value: STATUS.PLACED, label: 'PLACED' },
    { value: STATUS.CONFIRMED, label: 'CONFIRMED' },
    { value: STATUS.SENT, label: 'SENT' },
    { value: STATUS.DELIVERED, label: 'DELIVERED' },
    { value: STATUS.CANCELED, label: 'CANCELED' }

  ]

