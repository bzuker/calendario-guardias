<script>
	import '../app.css';
	import Content from '../components/content.svelte';
	import Sidebar from '../components/sidebar.svelte';
</script>

<div class="flex flex-col h-screen bg-white dark:bg-gray-800 dark:text-dark-body">
	<div class="flex-grow overflow-auto">
		<div class="flex h-full">
			<Sidebar />
			<Content>
				<slot />
			</Content>
		</div>
	</div>
</div>
