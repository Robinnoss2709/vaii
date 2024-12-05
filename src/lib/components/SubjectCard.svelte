<script>
    export let subject;
</script>

<div class="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl hover:shadow-green-400 transition-shadow duration-300 text-gray-900">
    <h2 class="text-2xl font-bold">{subject.name}</h2>
    <div class="flex flex-auto gap-3 bg-gray-200 rounded-md pl-2 mt-2">
        <div>
            <span class="text-red-500">
                {subject.study}
            </span>
        </div>

        <div class="relative group">
            <span class="text-blue-400 cursor-pointer underline">
                Odbor
            </span>
            <span class="absolute left-0 mt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm bg-gray-100 font-bold p-1 rounded-md z-10 whitespace-nowrap">
                {#each subject.fields as field}
                    <div>{field}</div>
                {/each}
            </span>
        </div>

        <div>
            <span class="text-orange-400">
                {subject.year}. roč.
            </span>
        </div>
        <div>
            <span class="text-green-400">
                {subject.semester}
            </span>
        </div>
    </div>

        <p class="mt-4">
            Testuj svoje znalosti z predmetu {subject.name}.
        </p>
        <a href="/tester/{subject.link}" class="mt-4 inline-block basic-button hover-bg-green">
            Otvoriť tester
        </a>
    
</div>
