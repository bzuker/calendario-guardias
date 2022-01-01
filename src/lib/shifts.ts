import {
	addDays,
	eachDayOfInterval,
	endOfWeek,
	format,
	getDay,
	isEqual,
	isWithinInterval,
	startOfWeek,
	subDays,
	subWeeks
} from 'date-fns';
import { shuffle } from 'lodash';

export interface Rule {
	name: string;
	condition: 'unavailable';
	date: Date;
}

export interface Person {
	name: string;
	rules: Rule[];
	color: string;
}

export interface Shift {
	date: Date;
	person: Person;
}

const PEOPLE_PER_DAY = 4;

// Create a schedule for all people following these conditions:
// - each person has at most 7 shifts assigned to them
// - each shift has a minimum of 2 days between it and the previous shift
// - every person has at least one free weekend during the month
// - every person has at most 2 shifts per week
export function calculateShiftsForRange(
	people: Person[],
	startDate: Date,
	endDate: Date,
	minPeoplePerDay: number = PEOPLE_PER_DAY - 1,
	maxPeoplePerDay: number = PEOPLE_PER_DAY
): Shift[] {
	let shifts = [];
	const days = eachDayOfInterval({ start: startDate, end: endDate });

	for (const day of days) {
		const shiftsForDay = getShiftsForDay(people, day, minPeoplePerDay, maxPeoplePerDay, shifts);
		shifts = [...shifts, ...shiftsForDay];
	}

	// for (const person of people) {
	// 	const shiftsForPerson = getShiftsForPerson(person, days, shifts);
	// 	shifts = [...shifts, ...shiftsForPerson];
	// }

	let countOfShiftsWithNotEnoughtPeople = 0;
	for (const day of days) {
		const shiftsForDay = shifts.filter((shift) => shift.date === day);
		if (shiftsForDay.length <= 2) throw new Error('not enough people');

		if (shiftsForDay.length < maxPeoplePerDay) {
			countOfShiftsWithNotEnoughtPeople++;
		}
	}

	if (countOfShiftsWithNotEnoughtPeople > 1) {
		throw new Error('Nope');
	}

	return shifts;
}

// Gets the shift for the given person following these conditions:
// - returns at most 7 shifts
// - has at most 2 shifts per week
// - each shift is at least 2 days away from the previous shift
// - has at least one free weekend during the month
function getShiftsForPerson(person: Person, days: Date[], existingShifts: Shift[]): Shift[] {
	const _existingShifts = [...existingShifts];
	const shifts: Shift[] = [];
	const shuffledDays = shuffle(days);

	for (const day of shuffledDays) {
		if (shifts.length >= 8) break;

		// Get the shifts for the current week, starting Monday
		const firstDayOfWeek = startOfWeek(day, { weekStartsOn: 1 });
		const lastDayOfWeek = endOfWeek(day, { weekStartsOn: 1 });
		const shiftsForLastWeek = existingShifts.filter((shift) =>
			isWithinInterval(shift.date, {
				start: subWeeks(firstDayOfWeek, 1),
				end: subWeeks(lastDayOfWeek, 1)
			})
		);

		// Check if the person is unavailable on the given day
		const ruleForDay = person.rules.find((rule) => isEqual(rule.date, day));
		if (ruleForDay?.condition === 'unavailable') {
			continue;
		}

		// Check if there are available slots for the day
		const shiftsForDay = _existingShifts.filter((shift) => isEqual(shift.date, day));
		if (shiftsForDay.length >= PEOPLE_PER_DAY) {
			continue;
		}

		// Check if the person has shifts on the last two or next two days
		const shiftsForLastAndNextTwoDays = _existingShifts.filter(
			(shift) =>
				shift.person.name === person.name &&
				isWithinInterval(shift.date, { start: subDays(day, 2), end: addDays(day, 2) })
		);

		if (shiftsForLastAndNextTwoDays.length > 0) {
			continue;
		}

		// Check if the person worked on the same day last week
		const workedSameDayLastWeek = shiftsForLastWeek
			.filter((shift) => shift.person.name === person.name)
			.some((shift) => getDay(shift.date) === getDay(day));

		if (workedSameDayLastWeek) {
			continue;
		}

		// Check if the person already has 3 weekends shifts
		const shiftsForPerson = _existingShifts.filter((shift) => shift.person.name === person.name);
		if (isWeekend(day)) {
			const shiftsOnWeekends = shiftsForPerson.filter((shift) => isWeekend(shift.date));
			if (shiftsOnWeekends.length >= 3) {
				// console.log(person.name, 'has 3 weekend shifts', format(day, 'dd/MM/yyyy'));
				continue;
			}
		}

		shifts.push({
			date: day,
			person
		});
		_existingShifts.push({
			date: day,
			person
		});
	}

	if (shifts.length < 6) {
		throw new Error('NOPE');
		// console.log(`Person ${person.name} has only ${shifts.length} shifts`);
	}

	return shifts;
}

// Get {peoplePerDay} people for the given day, following these conditions:
// - each person had no shift on the two previous days
// - each person had at most two shifts that week
// - if it's a weekend, prefer people who have not worked on weekend
export function getShiftsForDay(
	people: Person[],
	day: Date,
	minPeoplePerDay: number,
	maxPeoplePerDay: number,
	existingShifts: Shift[]
): Shift[] {
	const previousDay = subDays(day, 1);
	const previousDay2 = subDays(day, 2);

	// Get the shifts for the current week, starting Monday
	const firstDayOfWeek = startOfWeek(day, { weekStartsOn: 1 });
	const lastDayOfWeek = endOfWeek(day, { weekStartsOn: 1 });
	const shiftsForCurrentWeek = existingShifts.filter((shift) =>
		isWithinInterval(shift.date, { start: firstDayOfWeek, end: lastDayOfWeek })
	);
	const shiftsForLastWeek = existingShifts.filter((shift) =>
		isWithinInterval(shift.date, {
			start: subWeeks(firstDayOfWeek, 1),
			end: subWeeks(lastDayOfWeek, 1)
		})
	);

	// Get the shifts for the last two days
	const previousShifts = existingShifts.filter(
		(shift) =>
			shift.date.getTime() === previousDay.getTime() ||
			shift.date.getTime() === previousDay2.getTime()
	);

	// Get the available people for the given day
	const availablePeople = people.filter((person) => {
		// Check if the person is unavailable on the given day
		const ruleForDay = person.rules.find((rule) => isEqual(rule.date, day));
		if (ruleForDay?.condition === 'unavailable') {
			return false;
		}

		const shiftsForPerson = existingShifts.filter((shift) => shift.person.name === person.name);
		if (shiftsForPerson.length >= 8) {
			return false;
		}

		// Check if the person already has two shifts that week
		const shiftsOnCurrentWeek = shiftsForCurrentWeek.filter(
			(shift) => shift.person.name === person.name
		);
		if (shiftsOnCurrentWeek.length >= 2) {
			return false;
		}

		// Check if the person already has 4 weekdays shifts
		// if (isWeekday(day)) {
		// 	const shiftsOnWeekDays = existingShifts.filter(
		// 		(shift) => shift.person.name === person.name && isWeekday(shift.date)
		// 	);

		// 	if (shiftsOnWeekDays.length >= 4) {
		// 		console.log(person.name, 'has 4 weekdays shifts', format(day, 'dd/MM/yyyy'));

		// 		return false;
		// 	}
		// }

		// Check if the person already has 3 weekends shifts
		if (isWeekend(day)) {
			const workedSameDayLastWeek = shiftsForLastWeek
				.filter((shift) => shift.person.name === person.name)
				.some((shift) => getDay(shift.date) === getDay(day));

			if (workedSameDayLastWeek) {
				return false;
			}

			const shiftsOnWeekends = existingShifts.filter(
				(shift) => shift.person.name === person.name && isWeekend(shift.date)
			);
			if (shiftsOnWeekends.length >= 3) {
				// console.log(person.name, 'has 3 weekend shifts', format(day, 'dd/MM/yyyy'));
				return false;
			}
		}

		// Check if the person has a shift on the previous day
		const hasShiftOnPreviousDay = previousShifts.find((shift) => shift.person.name === person.name);
		const hasShiftOnPreviousDay2 = previousShifts.find(
			(shift) => shift.person.name === person.name
		);
		return !hasShiftOnPreviousDay && !hasShiftOnPreviousDay2;
	});

	if (availablePeople.length < minPeoplePerDay) {
		// throw new Error(`Not enough people available for day ${format(day, 'dd/MM/yyyy')}`);
		// console.log(`Not enough people available for day ${format(day, 'dd/MM/yyyy')}`);
	}

	// Pick four random people for the day
	const shifts: Shift[] = shuffle(availablePeople)
		// .sort((a, b) => {
		// 	const shiftsForA = existingShifts.filter((shift) => shift.person.name === a.name);
		// 	const shiftsForB = existingShifts.filter((shift) => shift.person.name === b.name);
		// 	if (shiftsForA.length === shiftsForB.length) return Math.random() > 0.5 ? 1 : -1;
		// 	return shiftsForA.length - shiftsForB.length;
		// })
		.slice(0, maxPeoplePerDay)
		.map((person) => ({
			date: day,
			person
		}));

	return shifts;
}

// We consider weekdays from Mon to Thu
function isWeekday(day: Date) {
	return day.getDay() !== 0 && day.getDay() !== 6 && day.getDay() !== 5;
}

function isWeekend(day: Date) {
	return !isWeekday(day);
}
