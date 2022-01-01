<script lang="ts">
	import { people, shifts } from '../stores/stores';
	import Calendar from '../components/calendar.svelte';

	const today = new Date();
	const month = today.getMonth() + 1;
	const year = today.getFullYear();
	$: {
		console.log('shifts', $shifts);
	}
	$: events = $shifts.map((shift) => ({
		date: shift.date,
		title: shift.person.name,
		style: `background-color: ${$people.find((p) => p.name === shift.person.name).color}`
	}));
</script>

<div class="p-5 pb-16 overflow-auto mx-auto container">
	<Calendar {events} {month} {year} />
</div>
