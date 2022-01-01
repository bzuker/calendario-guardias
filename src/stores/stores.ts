import type { Person, Shift } from '$lib/shifts';
import { rainbow } from '$lib/utils';
import { writable } from 'svelte/store';

export const people = writable<Person[]>([
	{
		name: 'Ani',
		rules: [],
		color: rainbow(15, 0)
	},
	{ name: 'Rene', rules: [], color: rainbow(20, 1) },
	{ name: 'Anto', rules: [], color: rainbow(20, 2) },
	{ name: 'Euge', rules: [], color: rainbow(20, 3) },
	{ name: 'Cami', rules: [], color: rainbow(20, 4) },
	{ name: 'Agus', rules: [], color: rainbow(20, 5) },
	{ name: 'Aye', rules: [], color: rainbow(20, 6) },
	{ name: 'Nay', rules: [], color: rainbow(20, 7) },
	{ name: 'Loli', rules: [], color: rainbow(20, 8) },
	{ name: 'Mari', rules: [], color: rainbow(20, 9) },
	{ name: 'Maru', rules: [], color: rainbow(20, 10) },
	{ name: 'Jose', rules: [], color: rainbow(20, 11) },
	{ name: 'Ger', rules: [], color: rainbow(20, 12) },
	{ name: 'Santi', rules: [], color: rainbow(20, 13) },
	{ name: 'Juli', rules: [], color: rainbow(20, 14) },
	{ name: 'Maca', rules: [], color: rainbow(20, 15) }
]);
export const shifts = writable<Shift[]>([]);

export const addPerson = (person: Person): void => {
	people.update((state) => {
		const newPeople = [...state, person];
		return newPeople;
	});
};

export const deletePerson = (name: string): void => {
	people.update((state) => {
		const newPeople = state.filter((person) => person.name !== name);
		return newPeople;
	});
};
