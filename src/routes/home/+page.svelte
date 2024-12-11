<script>
	import { Heading, P, Button, Card } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
</script>

<style>
    .header-gradient {
        width: 99rem;
        align-items: center;
        margin-top: 20px;
    }
</style>

<div class="header-gradient mx-auto text-center bg-gradient-to-b from-cyan-100 to-blue-300 shadow-md p-11 mb-12 rounded-xl">
	<Heading
		tag="h1"
		class="mb-4 text-center"
		customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl"
		>kind.</Heading
	>
	<P class="mb-6 text-center text-lg sm:px-16 lg:text-xl xl:px-48 dark:text-gray-400"
		>Making the World Better, One Act of Kindness at a Time</P
	>
	<Button href="/kind/volunteer">
		Get Started
		<ArrowRightOutline class="ms-2 h-6 w-6" />
	</Button>
</div>

<div class="services flex flex-col justify-content-center items-center min-h-screen">
    <Heading tag="h2" class="text-3xl font-semibold text-gray-800 text-center mb-4">
        Our Causes
    </Heading>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card class="p-6 shadow-lg rounded-lg border border-gray-200 bg-white hover:shadow-xl transition">
            <h3 class="text-xl font-bold text-primary-600 mb-4">Make a Difference Today</h3>
            <p class="text-gray-600">
                Join a community of volunteers and create positive change in your neighborhood.
            </p>
        </Card>
        <Card class="p-6 shadow-lg rounded-lg border border-gray-200 bg-white hover:shadow-xl transition">
            <h3 class="text-xl font-bold text-primary-600 mb-4">Track Your Impact</h3>
            <p class="text-gray-600">
                Upload proof of your volunteer work and see how you’re making a real difference.
            </p>
        </Card>
        <Card class="p-6 shadow-lg rounded-lg border border-gray-200 bg-white hover:shadow-xl transition">
            <h3 class="text-xl font-bold text-primary-600 mb-4">Support a Cause</h3>
            <p class="text-gray-600">
                Donate to a charity and boost your rank on the Kindness Board to inspire others.
            </p>
        </Card>
    </div>
</div>
