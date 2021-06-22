'use strict';

export const ANSWERTYPE: any =  {
    DATETIME:'DATETIME',
    NUMBER:'NUMBER',
    TEXT:'TEXT',
    DROPDOWN:'DROPDOWN',
    RADIO:'RADIO',
    CHECKBOX:'CHECKBOX',
}

export const ANSWER_LABELS: any[] =  [
    { value: ANSWERTYPE.DATETIME, label: 'Datetime' },
    { value: ANSWERTYPE.NUMBER, label: 'Number' },
    { value: ANSWERTYPE.TEXT, label: 'Text' },
    { value: ANSWERTYPE.DROPDOWN, label: 'Dropdown' },
    { value: ANSWERTYPE.RADIO, label: 'Radio' },
    { value: ANSWERTYPE.CHECKBOX, label: 'Checkbox'}
]

