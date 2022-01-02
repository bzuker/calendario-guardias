<script lang="ts">
	import { clickOutside } from '$lib/clickOutside';

	import type { Person, Rule } from '$lib/shifts.js';
	import { onMount } from 'svelte';
	import { deletePerson, updatePerson } from '../stores/stores';

	export let person: Person;
	let modalOpen = false;

	$: {
		console.log(person);
	}

	function onSubmit(e) {
		const formData = new FormData(e.target);

		const data: { date?: string } = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}

		if (!data.date) {
			return;
		}

		const newRule: Rule = {
			condition: 'unavailable',
			date: new Date(`${data.date}T00:00:00`),
			name: `No disponble el ${data.date}`
		};
		const ruleExists = person.rules.find((r) => r.name == newRule.name);
		if (ruleExists) return;

		updatePerson({
			...person,
			rules: [...person.rules, newRule]
		});
	}
</script>

<li class="bg-white flex items-center shadow-sm border border-gray-200 rounded-lg my-2 py-2 px-4">
	<input
		name="color"
		type="color"
		bind:value={person.color}
		on:change={(e) =>
			updatePerson({
				...person,
				color: e.currentTarget.value
			})}
		class="mr-2 h-5 w-5"
	/>
	<span class={`flex-1 text-gray-800`}>
		{person.name}
	</span>
	{#if person.rules.length > 0}
		<span class="text-xs px-2 mx-3 bg-gray-200 text-gray-800 rounded-full"
			>{person.rules.length}</span
		>
	{/if}
	<label for={`${person.name}-modal`} class="btn btn-xs px-1 modal-button">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="feather feather-arrow-up-right"
		>
			<line x1="7" y1="17" x2="17" y2="7" />
			<polyline points="7 7 17 7 17 17" />
		</svg>
	</label>
	<input
		type="checkbox"
		bind:checked={modalOpen}
		id={`${person.name}-modal`}
		class="modal-toggle"
	/>
	{#if modalOpen}
		<div class="modal">
			<div
				class="modal-box"
				use:clickOutside
				on:click_outside={() => {
					modalOpen = false;
				}}
			>
				<h1 class="text-lg font-bold py-2">Reglas para {person.name}</h1>
				<form class="mt-2 mb-4" on:submit|preventDefault={onSubmit}>
					<div class="flex flex-col text-sm mb-2">
						<label for="date" class="font-bold mb-2 text-gray-800 "> No disponible el </label>
						<div class="flex relative">
							<input
								type="date"
								name="date"
								placeholder="ej. Euge"
								autocomplete="off"
								class="rounded-l-md flex-1 appearance-none shadow-sm border border-gray-200 p-2 focus:outline-none"
							/>
							<button
								type="submit"
								class="rounded-r-md inline-flex items-center px-3 border-t bg-blue-500 text-white border-r border-b  border-gray-300  shadow-sm text-sm hover:bg-blue-600"
							>
								Agregar
							</button>
						</div>
					</div>
				</form>
				{#each person.rules as rule}
					<ul>
						<li class="py-1">
							{rule.name}
							<button
								type="button"
								class="text-sm text-red-600 hover:bg-red-600 hover:text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
								on:click={() =>
									updatePerson({
										...person,
										rules: person.rules.filter((r) => r.name !== rule.name)
									})}
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
									/><line x1="10" y1="11" x2="10" y2="17" /><line
										x1="14"
										y1="11"
										x2="14"
										y2="17"
									/></svg
								>
							</button>
						</li>
					</ul>
				{/each}
				<div class="modal-action">
					<button on:click={() => (modalOpen = false)} class="btn">Cerrar</button>
				</div>
			</div>
		</div>
	{/if}
</li>
