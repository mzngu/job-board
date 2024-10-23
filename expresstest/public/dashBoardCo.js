const offerUrl = 'http://127.0.0.1:5503/offer';

document.addEventListener('DOMContentLoaded', () => {
    const jobsContainer = document.getElementById('jobs-container');
    const applicationsContainer = document.getElementById('applications-container');
    const addJobButton = document.getElementById('add-job-button');
    const addJobForm = document.getElementById('add-job-form');
    const jobForm = document.getElementById('job-form');

    
    function fetchJobOffers() {
        fetch('/api/job-offers')
            .then(response => response.json())
            .then(data => {
                jobsContainer.innerHTML = '';
                data.forEach(job => {
                    const jobAd = document.createElement('div');
                    jobAd.classList.add('job-ad');
                    jobAd.innerHTML = `
                        <h3>${job.title}</h3>
                        <p>${job.libelle}</p>
                        <p>Type: ${job.jobType} | Time: ${job.workingTime}</p>
                        <p>${job.city}, ${job.country}</p>
                        <button onclick="editJobForm(${job.offerID})">Edit</button>
                        <button onclick="removeJob(${job.offerID})">Remove</button>
                    `;
                    jobsContainer.appendChild(jobAd);
                });
            });
    }

    
    function fetchApplications() {
        fetch('/api/applications')
            .then(response => response.json())
            .then(data => {
                applicationsContainer.innerHTML = '';
                data.forEach(app => {
                    const application = document.createElement('div');
                    application.classList.add('application');
                    application.innerHTML = `
                        <h3>Application for ${app.jobTitle}</h3>
                        <p>Applicant: ${app.name}</p>
                        <p>Email: ${app.email}</p>
                        <p>Status: ${app.status}</p>
                    `;
                    applicationsContainer.appendChild(application);
                });
            });
    }

    
    addJobButton.addEventListener('click', () => {
        addJobForm.style.display = 'block';
    });

    
    jobForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const jobData = {
            title: document.getElementById('title').value,
            libelle: document.getElementById('libelle').value,
            jobType: document.getElementById('jobType').value,
            workingTime: document.getElementById('workingTime').value,
            contractType: document.getElementById('contractType').value,
            salary: document.getElementById('salary').value,
            country: document.getElementById('country').value,
            city: document.getElementById('city').value,
            adress: document.getElementById('adress').value,
            zipCode: document.getElementById('zipCode').value,
            companyID: document.getElementById('companyID').value
        };

        fetch('/api/job-offers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jobData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            addJobForm.style.display = 'none';
            jobForm.reset();
            fetchJobOffers(); 
        })
        .catch(error => console.error('Error:', error));
    });

    
    function editJobForm(offerID) {
        
        fetch(`/api/job-offers/${offerID}`)
            .then(response => response.json())
            .then(job => {
                
                addJobForm.style.display = 'block';
                document.getElementById('title').value = job.title;
                document.getElementById('libelle').value = job.libelle;
                document.getElementById('jobType').value = job.jobType;
                document.getElementById('workingTime').value = job.workingTime;
                document.getElementById('contractType').value = job.contractType;
                document.getElementById('salary').value = job.salary;
                document.getElementById('country').value = job.country;
                document.getElementById('city').value = job.city;
                document.getElementById('adress').value = job.adress;
                document.getElementById('zipCode').value = job.zipCode;
                document.getElementById('companyID').value = job.companyID;

                
                jobForm.onsubmit = function(event) {
                    event.preventDefault();
                    const jobData = {
                        title: document.getElementById('title').value,
                        libelle: document.getElementById('libelle').value,
                        jobType: document.getElementById('jobType').value,
                        workingTime: document.getElementById('workingTime').value,
                        contractType: document.getElementById('contractType').value,
                        salary: document.getElementById('salary').value,
                        country: document.getElementById('country').value,
                        city: document.getElementById('city').value,
                        adress: document.getElementById('adress').value,
                        zipCode: document.getElementById('zipCode').value,
                    };

                    fetch(`/api/job-offers/${offerID}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(jobData)
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert(data.message);
                        addJobForm.style.display = 'none';
                        jobForm.reset();
                        jobForm.onsubmit = null; 
                        fetchJobOffers(); 
                    })
                    .catch(error => console.error('Error:', error));
                };
            })
            .catch(error => console.error('Error fetching job:', error));
    }

    
    function removeJob(jobId) {
        fetch(`/api/job-offers/${jobId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchJobOffers(); 
        })
        .catch(error => console.error('Error:', error));
    }

    
    fetchJobOffers();
    fetchApplications();
});


