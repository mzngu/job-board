const apiUrl = "http://localhost:4444";

async function createUser() {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // Get form values
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const birthday = document.getElementById("birthday").value;
        const phoneNumber = document.getElementById("phoneNumber").value;
        const gender = document.getElementById("gender").value;
        const employer = document.getElementById("employer").value;
        const country = document.getElementById("country").value;
        const city = document.getElementById("city").value;
        const adress = document.getElementById("adress").value;
        const zipCode = document.getElementById("zipCode").value;

        // Send POST request with form data
        const response = await fetch(`${apiUrl}/auth/signup`, {
            method: 'POST',
            body: JSON.stringify({
                firstName,
                lastName,
                username,
                password,
                birthday,
                phoneNumber,
                gender,
                employer,
                country,
                city,
                adress,
                zipCode
            }),
            headers: myHeaders,
        });

        if (response.ok) {
            console.log(await response.json());
            alert("User created successfully!");
        } else {
            console.error("Failed to create user.");
            alert("Failed to create user.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function createCompany() {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch(`${apiUrl}/company`, {
            method: 'POST',
            body: JSON.stringify({
                companyName : "company test 2",
                legalStatus : "SAS",
                activitySector : "Informatique"
            }),
            headers: myHeaders,
        });

        if (response.ok) {
            console.log( response.json());
        } else {
            console.error("Failed to fetch jobs.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function createJob() {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch(`${apiUrl}/offer`, {
            method: 'POST',
            body: JSON.stringify({
                title : "title test 2",
                libelle : "Texte de l'annonce avec sa description ses missions etc...",
                jobType : "Temps complet",
                workingTime : "35 heures par semaine",
                contractType : "CDI",
                salary : "2000 euros net par mois",
                country : "France",
                city : "Montpellier",
                adress : "5 rue du test",
                zipCode : "34000",
                companyID : "1"
            }),
            headers: myHeaders,
        });

        if (response.ok) {
            console.log( response.json());
        } else {
            console.error("Failed to fetch jobs.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function fetchJobs() {

    try {
        const response = await fetch(`${apiUrl}/offer`, {
            method: 'GET'
        });

        if (response.ok) {
            const jobs = await response.json();
            displayJobs(jobs);
        } else {
            console.error("Failed to fetch jobs.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function displayJobs(jobs) {
    const jobsListContainer = document.querySelector('.jobs-list');
    
    // Clear any previous job listings
    jobsListContainer.innerHTML = `
        <h2>Available Jobs</h2>
        <input type="button" id='getData' onclick="fetchJobs()" value="fetchJobs">           
    `;

    // Create job elements
    jobs.forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.classList.add('job');

        // Create an array of job details
        const jobDetails = [
            `Title: ${job.title}`,
            `Description: ${job.libelle}`,
            `Job Type: ${job.jobType}`,
            `Working Time: ${job.workingTime}`,
            `Contract Type: ${job.contractType}`,
            `Salary: ${job.salary}`,
            `Location: ${job.adress}, ${job.city}, ${job.zipCode}, ${job.country}`,
            `Company ID: ${job.companyID}`
        ];

        // Convert the job details array into an HTML list
        const jobDetailsHTML = `<ul>` + jobDetails.map(detail => `<li>${detail}</li>`).join('') + `</ul>`;

        jobElement.innerHTML = jobDetailsHTML;
        jobsListContainer.appendChild(jobElement);
    });
}