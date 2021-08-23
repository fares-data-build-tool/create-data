import { clickElementById, getElementByClass, getElementByName } from './helpers';

interface TimeRestriction {
    days: string[];
    name: string;
}

const enterTimeRestrictionDetails = ({ days, name }: TimeRestriction) => {
    days.map(clickElementById);

    getElementByName('timeRestrictionName').clear().type(name);
};

const addTimeRestriction = (passengerType: TimeRestriction) => {
    cy.contains('Add a time restriction').click();
    enterTimeRestrictionDetails(passengerType);
    cy.contains('Add time restriction').click();
};

export const createEditTimeRestriction = (): void => {
    const timeRestriction = {
        days: ['time-restriction-day-5', 'time-restriction-day-6'],
        name: 'Weekends',
    };

    addTimeRestriction(timeRestriction);

    const timeRestrictionCard = getElementByClass('card').eq(0);
    timeRestrictionCard.should('include.text', timeRestriction.name);
    timeRestrictionCard.should('include.text', 'Valid all day');

    timeRestrictionCard.contains('Edit').click();

    const editedTimeRestriction = {
        days: [
            'time-restriction-day-0',
            'time-restriction-day-1',
            'time-restriction-day-2',
            'time-restriction-day-3',
            'time-restriction-day-4',
            'time-restriction-day-5',
            'time-restriction-day-6',
            'time-restriction-day-7',
        ],
        name: 'Working Days',
    };

    enterTimeRestrictionDetails(editedTimeRestriction);

    cy.contains('Update time restriction').click();

    const editedCard = getElementByClass('card').eq(0);
    editedCard.should('include.text', editedTimeRestriction.name);
    timeRestrictionCard.should('include.text', 'Valid all day');
};
