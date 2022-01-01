import type { Person, Shift } from '$lib/shifts';
import { selectColor } from '$lib/utils';
import { writable } from 'svelte/store';

export const people = writable<Person[]>([
	{
		name: 'Ani',
		rules: [],
		color: selectColor(0)
	},
	{ name: 'Rene', rules: [], color: selectColor(1) },
	{ name: 'Anto', rules: [], color: selectColor(2) },
	{ name: 'Euge', rules: [], color: selectColor(3) },
	{ name: 'Cami', rules: [], color: selectColor(4) },
	{ name: 'Agus', rules: [], color: selectColor(5) },
	{ name: 'Aye', rules: [], color: selectColor(6) },
	{ name: 'Nay', rules: [], color: selectColor(7) },
	{ name: 'Loli', rules: [], color: selectColor(8) },
	{ name: 'Mari', rules: [], color: selectColor(9) },
	{ name: 'Maru', rules: [], color: selectColor(10) },
	{ name: 'Jose', rules: [], color: selectColor(11) },
	{ name: 'Ger', rules: [], color: selectColor(12) },
	{ name: 'Santi', rules: [], color: selectColor(13) },
	{ name: 'Juli', rules: [], color: selectColor(14) },
	{ name: 'Maca', rules: [], color: selectColor(15) }
]);
export const shifts = writable<Shift[]>([]);

export const addPerson = (person: Person): void => {
	people.update((state) => {
		if (state.find((p) => p.name === person.name)) {
			alert(`${person.name} ya está en la lista`);
			return;
		}
		const newPeople = [...state, person];
		return newPeople;
	});
};

export const updatePerson = (person: Person): void => {
	people.update((state) => {
		const newPeople = state.map((p) => {
			if (p.name === person.name) {
				return person;
			}
			return p;
		});
		return newPeople;
	});
};

export const deletePerson = (name: string): void => {
	people.update((state) => {
		const newPeople = state.filter((person) => person.name !== name);
		return newPeople;
	});
};
