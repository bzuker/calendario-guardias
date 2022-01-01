<script lang="ts">
	import { shifts } from '../stores/stores';
	import Calendar from '../components/calendar.svelte';

	const today = new Date();
	const month = today.getMonth() + 1;
	const year = today.getFullYear();

	$: events = $shifts.map((shift) => ({
		date: shift.date,
		title: shift.person.name,
		style: `background-color: ${shift.person.color}`
	}));
</script>

<div class="p-5 pb-16 overflow-auto mx-auto container">
	<Calendar {events} {month} {year} />
</div>
