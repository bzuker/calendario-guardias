<script lang="ts">
	import calendarize from 'calendarize';
	import Arrow from './Arrow.svelte';

	export let year = 2022;
	export let month = 0; // Jan
	export let offset = 1; // Sun
	export let today = new Date(); // Date

	export let labels = ['Dom', 'Lu', 'Ma', 'Mie', 'Jue', 'Vie', 'Sab'];
	export let months = [
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre'
	];

	interface Event {
		date: Date;
		title: string;
		style: string;
	}

	export let events: Event[] = [];

	$: today_month = today && today.getMonth();
	$: today_year = today && today.getFullYear();
	$: today_day = today && today.getDate();

	let prev = calendarize(new Date(year, month - 1), offset);
	let current = calendarize(new Date(year, month), offset);
	let next = calendarize(new Date(year, month + 1), offset);

	function toPrev() {
		[current, next] = [prev, current];

		if (--month < 0) {
			month = 11;
			year--;
		}

		prev = calendarize(new Date(year, month - 1), offset);
	}

	function toNext() {
		[prev, current] = [current, next];

		if (++month > 11) {
			month = 0;
			year++;
		}

		next = calendarize(new Date(year, month + 1), offset);
	}

	function isToday(day) {
		return today && today_year === year && today_month === month && today_day === day;
	}

	function getTodayEvents(day, events) {
		const todayEvents = events.filter(
			(event) =>
				event.date.getDate() === day &&
				event.date.getMonth() === month &&
				event.date.getFullYear() === year
		);
		return todayEvents;
	}
</script>

<div class="flex flex-grow w-full min-h-screen">
	<div class="flex flex-col flex-grow">
		<div class="flex items-center justify-center mt-4">
			<Arrow left on:click={toPrev} />
			<h2 class="ml-2 text-xl font-bold leading-none">{months[month]} {year}</h2>
			<Arrow on:click={toNext} />
		</div>

		<div class="grid grid-cols-7 mt-4">
			{#each labels as txt, idx (txt)}
				<div class="pl-1 text-sm">{labels[(idx + offset) % 7]}</div>
			{/each}
		</div>

		<div class="grid flex-1 w-full h-auto grid-cols-7 grid-rows-5 gap-px pt-px mt-1">
			{#each { length: 6 } as w, idxw (idxw)}
				{#if current[idxw]}
					{#each { length: 7 } as d, idxd (idxd)}
						<div class="relative flex flex-col bg-white group border-gray-200 border">
							{#if current[idxw][idxd] != 0}
								<span
									class="mx-2 my-1 text-md font-bold "
									class:text-purple-500={isToday(current[idxw][idxd])}
								>
									{current[idxw][idxd]}
								</span>
							{:else if idxw < 1}
								<span class="mx-2 my-1 text-md font-light">{prev[prev.length - 1][idxd]}</span>
							{:else}
								<span class="mx-2 my-1 text-md font-light">{next[0][idxd]}</span>
							{/if}
							<div class="flex flex-col px-1 py-1 overflow-auto space-y-2">
								{#each getTodayEvents(current[idxw][idxd], events) as event (event.title)}
									<div class="flex items-center w-full flex-1 h-5 px-1">
										<span
											class={`w-full text-center font-semibold antialiased leading-none truncate py-2 px-3 rounded`}
											style={event.style}
										>
											{event.title}
										</span>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				{/if}
			{/each}
		</div>
	</div>
</div>
