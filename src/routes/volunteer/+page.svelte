<script lang="ts">
    import { Spinner } from "flowbite-svelte";
    import { onMount } from "svelte";
    import { jsPDF } from "jspdf";

    let latitude: number;
    let longitude: number;
    let volunteerOpportunities: any[] = [];
    let errorMessage: string = '';
    let loading: boolean = true;

    let firstName = "";
    let lastName = "";
    let proofFile: File | null = null;
    let certificateGenerated = false;
    let modalOpen = false;
    let activePage = "opportunities";

    let users: { [key: string]: number } = {};

    onMount(() => {
        getLocation();
        const savedData = localStorage.getItem("usersData");
        if (savedData) users = JSON.parse(savedData);
    });

    async function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    fetchVolunteerOpportunities(latitude, longitude);
                },
                () => {
                    errorMessage = 'Unable to retrieve your location.';
                    loading = false;
                }
            );
        } else {
            errorMessage = 'Geolocation is not supported by this browser.';
            loading = false;
        }
    }

    async function fetchVolunteerOpportunities(latitude: number, longitude: number) {
        const url = `https://www.volunteerconnector.org/api/search/?lat=${latitude}&lon=${longitude}&radius=25&limit=5`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch volunteer opportunities');
            const data = await res.json();
            if (data.results && Array.isArray(data.results) && data.results.length > 0) {
                volunteerOpportunities = data.results;
            } else {
                errorMessage = 'No volunteer opportunities available at the moment.';
            }
        } finally {
            loading = false;
        }
    }

    const handleFileUpload = (event: Event) => {
        const input = event.target as HTMLInputElement;
        if (input?.files?.[0]) {
            proofFile = input.files[0];
        }
    };

    const generateCertificate = () => {
        if (!firstName || !lastName || !proofFile) return;

        const doc = new jsPDF('l','mm','letter');
        doc.setFontSize(90)
        doc.text("kind.", 100,30)
        doc.setFontSize(30);
        doc.text("Certificate of Volunteering", 70, 40);
        doc.setFontSize(20);
        doc.text(`This is to certify that`, 80, 70);
        doc.setFontSize(30)
        doc.text(`${firstName} ${lastName}`, 40, 90);
        doc.setFontSize(20)
        doc.text("has successfully completed the volunteer work.", 60, 110);
        doc.text("Thank you for your valuable contribution!", 60, 130);

        doc.save(`${firstName}_${lastName}_certificate.pdf`);
        users[`${firstName} ${lastName}`] = (users[`${firstName} ${lastName}`] || 0) + 1;
        localStorage.setItem("usersData", JSON.stringify(users));
        certificateGenerated = true;
        modalOpen = false;
    };

    const openModal = () => {
        modalOpen = true;
    };

    const closeModal = () => {
        modalOpen = false;
        firstName = "";
        lastName = "";
        proofFile = null;
        certificateGenerated = false;
    };

    const navigate = (page: string) => {
        activePage = page;
    };
</script>

<main>
    <nav class="bg-white text-black p-4">
        <ul class="flex space-x-4 float-right">
            <li><button on:click={() => navigate("opportunities")} class="hover:bg-gray-200 p-2 rounded">Opportunities</button></li>
            <li><button on:click={() => navigate("kindnessMeter")} class="hover:bg-gray-200 p-2 rounded">Kindness Meter</button></li>
        </ul>
    </nav>

    {#if activePage === "opportunities"}
        <section>
            <h1 class="text-2xl font-bold text-center mx-auto my-4">Volunteer Opportunities</h1>
            {#if loading}
                <Spinner />
            {:else if errorMessage}
                <p>{errorMessage}</p>
            {:else if volunteerOpportunities.length > 0}
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {#each volunteerOpportunities as opportunity}
                        <div class="border p-4 rounded-lg shadow">
                            <img src={`https:${opportunity.organization.logo}`} alt={opportunity.organization.name} class="w-16 h-16 mb-4" />
                            <h2 class="text-lg font-semibold">{opportunity.title}</h2>
                            <p>{opportunity.description}</p>
                            <button on:click={openModal} class="mt-4 text-white bg-blue-500 px-4 py-2 rounded">Generate Certificate</button>
                            <a href={opportunity.url} target="_blank" class="mt-2 inline-block text-white bg-green-500 px-4 py-2 rounded">Sign Up</a>
                        </div>
                    {/each}
                </div>
            {:else}
                <p>No volunteer opportunities available at the moment.</p>
            {/if}
        </section>
    {:else if activePage === "kindnessMeter"}
        <section>
            <h1 class="text-2xl font-bold text-center my-4">Kindness Meter</h1>
            <table class="table-auto border-collapse border border-gray-400 mt-4 mx-auto">
                <thead>
                    <tr>
                        <th class="border border-gray-300 px-4 py-2">Name</th>
                        <th class="border border-gray-300 px-4 py-2">Kind Act(s) completed</th>
                    </tr>
                </thead>
                <tbody>
                    {#each Object.entries(users) as [name, count]}
                        <tr>
                            <td class="border border-gray-300 px-4 py-2">{name}</td>
                            <td class="border border-gray-300 px-4 py-2">{count}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </section>
    {/if}

    {#if modalOpen}
    <div class="modal-overlay">
        <div class="modal-content">
            <h3>Volunteer Certificate</h3>
            <form on:submit|preventDefault={generateCertificate} class="flex flex-col gap-4">
                <input
                    type="text"
                    bind:value={firstName}
                    placeholder="First Name"
                    required
                    class="mb-4 p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    bind:value={lastName}
                    placeholder="Last Name"
                    required
                    class="mb-4 p-2 border border-gray-300 rounded"
                />
                <input
                    type="file"
                    accept="image/*, .pdf"
                    on:change={handleFileUpload}
                    required
                    class="mb-4 p-2 border border-gray-300 rounded"
                />
                <button
                    type="submit"
                    class="bg-blue-500 text-white p-2 rounded mt-4"
                    disabled={!firstName || !lastName || !proofFile}
                >
                    Generate Certificate
                </button>
                <button type="button" on:click={closeModal} class="text-red-500 mt-4">
                    Close
                </button>
            </form>
            {#if certificateGenerated}
                <p>Your certificate has been generated! Check your downloads folder.</p>
            {/if}
        </div>
    </div>
    
    {/if}
</main>

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        width: 100%;
        max-width: 400px;
    }
</style>
