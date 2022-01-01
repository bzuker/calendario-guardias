<script lang="ts">
	import type { Person } from '$lib/shifts.js';
	import { deletePerson } from '../stores/stores';

	export let person: Person;
	console.log(person);

	$: {
		console.log(person.color);
	}
</script>

<li class="bg-white flex items-center shadow-sm border border-gray-200 rounded-lg my-2 py-2 px-4">
	<input name="color" type="color" bind:value={person.color} class="mr-2 h-5 w-5" />
	<span class={`flex-1 text-gray-800`}>
		{person.name}
	</span>
	<button
		type="button"
		class="text-sm text-red-600 hover:bg-red-600 hover:text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
		on:click={() => deletePerson(person.name)}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<polyline points="3 6 5 6 21 6" />
			<path
				d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
			/><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg
		>
	</button>
</li>
