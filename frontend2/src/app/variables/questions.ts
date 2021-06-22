'use strict'

export const QUESTIONS=[
    {
        id:1,
        description: 'First Test',
        question: 'Is this your first test for this disease',
        answer_type:'RADIO',
        answers:['YES','NO']
    },
    {
        id:2,
        description: 'Employed in Healthcare',
        question: 'Are you at the moment Employed in a Healthcare Facilty?',
        answer_type:'RADIO',
        answers:['YES','NO']
    },
    {
        id:3,
        description: 'Symptomatic',
        question: 'Are you symptomatic as defined by the CDC?',
        answer_type:'RADIO',
        answers:['YES','NO']
    },
    {
        id:4,
        description: 'Symptoms start',
        question: 'When did your symptoms start occuring?',
        answer_type:'DATE',
        parent:{
            id:3,
            description: 'Symptomatic',
            question: 'Are you symptomatic as defined by the CDC?',
            answer_type:'RADIO',
            answers:['YES','NO']
        },
    },
	{
        id:5,
        description: 'Hospitalized',
        question: 'Have you been hospitalized already before?',
        answer_type:'RADIO',
        answers:['YES','NO']
    },
	{
        id:6,
        description: 'ICU',
        question: 'Have you been admitted to an ICU?',
        answer_type:'RADIO',
        answers:['YES','NO']
    },
	{
        id:7,
        description: 'Congregate care setting',
        question: 'Are you a rezident in a congregate care setting?',
        answer_type:'RADIO',
        answers:['YES','NO']
    },
	{
        id:8,
        description: 'Pregnant',
        question: 'Are you at the moment pregnant?',
        answer_type:'RADIO',
        answers:['YES','NO']
    }

]