<script>
	import { addDays, addMonths, endOfMonth, startOfMonth } from 'date-fns';
	import { calculateShiftsForRange } from '../lib/shifts';

	import { people, shifts } from '../stores/stores';

	import PersonForm from './person-form.svelte';
	import Person from './person.svelte';

	let now = new Date();
	let loading = false;

	const startOfNextMonth = startOfMonth(addMonths(now, 1));
	const endOfNextMonth = endOfMonth(startOfNextMonth);

	$: dateFrom = new Date(startOfNextMonth.getTime() - startOfNextMonth.getTimezoneOffset() * 60000)
		.toISOString()
		.split('T')[0];
	$: dateTo = new Date(endOfNextMonth.getTime() - endOfNextMonth.getTimezoneOffset() * 60000)
		.toISOString()
		.split('T')[0];

	let minimumPeoplePerDay = 3;
	let maxPeoplePerDay = 4;

	function wait(time) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, time);
		});
	}

	async function getShifts() {
		let found = false;
		loading = true;
		await wait(1);
		$shifts = [];

		for (let index = 0; index < 2000; index++) {
			try {
				const newShifts = calculateShiftsForRange(
					$people,
					addDays(new Date(dateFrom), 1),
					addDays(new Date(dateTo), 1),
					minimumPeoplePerDay,
					maxPeoplePerDay
				);
				$shifts = newShifts;
				found = true;
			} catch (error) {}
		}

		loading = false;
		if (!found) {
			alert('No encontré combinaciones. Volvé a intentar o cambiá algunas reglas');
		}
	}
</script>

<nav class="flex-shrink-0 w-72 overflow-auto">
	<div class="flex flex-col bg-gray-200 bg-opacity-30 relative">
		<nav class="mt-3">
			<div class="flex w-full items-center justify-center text-sm antialiased font-medium">
				Fechas a calcular
			</div>
			<hr class="my-3" />
			<div class="flex flex-col px-4">
				<input
					type="date"
					class="text-sm appearance-none shadow-sm border border-gray-200 p-2 focus:outline-none"
					name="dateFrom"
					bind:value={dateFrom}
				/>
				<input
					type="date"
					class="text-sm appearance-none shadow-sm border border-gray-200 p-2 focus:outline-none"
					name="dateTo"
					bind:value={dateTo}
				/>
			</div>
			<hr class="my-3" />
			<div class="flex w-full items-center justify-center text-sm antialiased font-medium">
				Personas por día
			</div>
			<hr class="my-3" />
			<div class="px-4 text-sm">
				<div class="mb-4">
					<p class="font-bold mb-2 text-gray-800 ">Mínimo</p>
					<div class="inline-flex rounded-md shadow-sm" role="group">
						<button
							type="button"
							class:bg-gray-300={minimumPeoplePerDay === 1}
							class="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10"
							on:click={() => (minimumPeoplePerDay = 1)}
						>
							1
						</button>
						<button
							type="button"
							class:bg-gray-300={minimumPeoplePerDay === 2}
							class="py-2 px-4 text-sm font-medium text-gray-900 bg-white border-t border-r border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10"
							on:click={() => (minimumPeoplePerDay = 2)}
						>
							2
						</button>
						<button
							type="button"
							class:bg-gray-300={minimumPeoplePerDay === 3}
							class="py-2 px-4 text-sm font-medium text-gray-900 bg-white border-t border-r border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10"
							on:click={() => (minimumPeoplePerDay = 3)}
						>
							3
						</button>
						<button
							type="button"
							class:bg-gray-300={minimumPeoplePerDay === 4}
							class="py-2 px-4 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10"
							on:click={() => (minimumPeoplePerDay = 4)}
						>
							4
						</button>

						<button
							type="button"
							class:bg-gray-300={minimumPeoplePerDay === 5}
							class="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10"
							on:click={() => (minimumPeoplePerDay = 5)}
						>
							5
						</button>
					</div>
				</div>
				<div class="mb-4">
					<p class="font-bold mb-2 text-gray-800 ">Máximo</p>
					<div class="inline-flex rounded-md shadow-sm" role="group">
						<button
							type="button"
							class:bg-gray-300={maxPeoplePerDay === 1}
							class="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10"
							on:click={() => (maxPeoplePerDay = 1)}
						>
							1
						</button>
						<button
							type="button"
							class:bg-gray-300={maxPeoplePerDay === 2}
							class="py-2 px-4 text-sm font-medium text-gray-900 bg-white border-t border-r border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10"
							on:click={() => (maxPeoplePerDay = 2)}
						>
							2
						</button>
						<button
							type="button"
							class:bg-gray-300={maxPeoplePerDay === 3}
							class="py-2 px-4 text-sm font-medium text-gray-900 bg-white border-t border-r border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10"
							on:click={() => (maxPeoplePerDay = 3)}
						>
							3
						</button>
						<button
							type="button"
							class:bg-gray-300={maxPeoplePerDay === 4}
							class="py-2 px-4 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10"
							on:click={() => (maxPeoplePerDay = 4)}
						>
							4
						</button>

						<button
							type="button"
							class:bg-gray-300={maxPeoplePerDay === 5}
							class="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10"
							on:click={() => (maxPeoplePerDay = 5)}
						>
							5
						</button>
					</div>
				</div>
			</div>
			<hr class="my-3" />

			<div class="flex w-full items-center justify-center text-sm antialiased font-medium">
				Personas
			</div>
			<hr class="my-3" />
			<div class="px-4 mb-8">
				<PersonForm />
				<ul>
					{#each $people as person (person.name)}
						<Person {person} />
					{/each}
				</ul>
			</div>

			<div class="sticky bottom-0 w-full">
				<button
					disabled={loading}
					class="w-full shadow-sm bg-blue-500 hover:bg-blue-600 text-white py-2 px-4"
					on:click={() => getShifts()}
				>
					{loading ? 'Buscando...' : 'Calcular'}
				</button>
			</div>
		</nav>
	</div>
</nav>
