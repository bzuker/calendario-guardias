<script lang="ts">
	import { rainbow } from '$lib/utils';

	import { addPerson, people } from '../stores/stores';

	let name: string = '';
	function getColor() {
		return '#' + Math.floor(Math.random() * 16777215).toString(16);
	}

	const handleSubmit = () => {
		addPerson({ name, rules: [], color: rainbow(30, $people.length + 1) });
		name = '';
	};
</script>

<form class="mt-2 mb-4" on:submit|preventDefault={handleSubmit}>
	<div class="flex flex-col text-sm mb-2">
		<label for="name" class="font-bold mb-2 text-gray-800 "> Nombre </label>
		<div class="flex relative">
			<input
				type="text"
				name="name"
				bind:value={name}
				placeholder="ej. Euge"
				autocomplete="off"
				class="rounded-l-md flex-1 appearance-none shadow-sm border border-gray-200 p-2 focus:outline-none"
			/>
			<button
				type="submit"
				class="rounded-r-md inline-flex items-center px-3 border-t bg-white border-r border-b  border-gray-300 text-gray-500 shadow-sm text-sm"
			>
				Ok
			</button>
		</div>
	</div>
</form>
