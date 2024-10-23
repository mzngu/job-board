const offerEndpoint = 'http://127.0.0.1:5501/offer';

document.addEventListener('DOMContentLoaded', () => {
    const jobsContainer = document.getElementById('jobs-container');
    const searchBar = document.getElementById('search-bar');

    let jobsData = [];

    
    fetch(offerEndpoint)
        .then(response => response.json())
        .then(data => {
            jobsData = data;
            displayJobs(jobsData);
        })
        .catch(error => {
            console.error("Failed to fetch job data:", error);
        });

    const displayJobs = (jobs) => {
        jobsContainer.innerHTML = '';
        jobs.forEach(job => {
            const jobAd = document.createElement('div');
            jobAd.classList.add('job-ad');

            const jobTitle = document.createElement('h2');
            jobTitle.classList.add('job-title');
            jobTitle.textContent = job.title;

            const jobDescription = document.createElement('p');
            jobDescription.classList.add('job-description');
            jobDescription.textContent = job.libelle;

            const jobDetails = document.createElement('ul');
            jobDetails.classList.add('job-details');
            jobDetails.style.display = 'none';

            const learnMoreButton = document.createElement('button');
            learnMoreButton.classList.add('learn-more');
            learnMoreButton.textContent = 'Learn More';
            learnMoreButton.onclick = () => {
                if (jobDetails.style.display === 'none') {
                    fetch(`${offerEndpoint}/${job.offerID}`)
                        .then(response => response.json())
                        .then(jobData => {

                            jobDetails.innerHTML = ''; 

                            const jobTypeItem = document.createElement('li');
                            jobTypeItem.textContent = `Job Type: ${jobData.jobType}`;
                            const workingTimeItem = document.createElement('li');
                            workingTimeItem.textContent = `Working Time: ${jobData.workingTime}`;
                            const contractTypeItem = document.createElement('li');
                            contractTypeItem.textContent = `Contract Type: ${jobData.contractType}`;
                            const salaryItem = document.createElement('li');
                            salaryItem.textContent = `Salary: ${jobData.salary}`;
                            const locationItem = document.createElement('li');
                            locationItem.textContent = `Location: ${jobData.city}, ${jobData.country}`;
                            const addressItem = document.createElement('li');
                            addressItem.textContent = `Address: ${jobData.adress} - ${jobData.zipCode}`;

                            jobDetails.appendChild(jobTypeItem);
                            jobDetails.appendChild(workingTimeItem);
                            jobDetails.appendChild(contractTypeItem);
                            jobDetails.appendChild(salaryItem);
                            jobDetails.appendChild(locationItem);
                            jobDetails.appendChild(addressItem);

                            jobDetails.style.display = 'block';
                        })
                        .catch(err => console.error("Failed to fetch job details:", err));
                } else {
                    jobDetails.style.display = 'none';
                }
            };

            const applyFormContainer = document.createElement('div');
            applyFormContainer.classList.add('apply-form-container');
            applyFormContainer.style.display = 'none';

            const applyTextArea = document.createElement('textarea');
            applyTextArea.id = `motivation-${job.offerID}`;
            applyTextArea.placeholder = "Write your motivation letter here...";

            const applyButton = document.createElement('button');
            applyButton.classList.add('apply');
            applyButton.textContent = 'Apply';
            applyButton.onclick = () => {
                applyFormContainer.style.display = applyFormContainer.style.display === 'none' ? 'block' : 'none';
            };

            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit Application';
            submitButton.onclick = () => {
                const motivationLetter = document.getElementById(`motivation-${job.offerID}`).value;
                console.log(`Submitting application for ${job.title} with motivation: ${motivationLetter}`);
                alert('Application submitted successfully!');
                applyFormContainer.style.display = 'none';
            };

            applyFormContainer.appendChild(applyTextArea);
            applyFormContainer.appendChild(submitButton);

            jobAd.appendChild(jobTitle);
            jobAd.appendChild(jobDescription);
            jobAd.appendChild(jobDetails);
            jobAd.appendChild(learnMoreButton);
            jobAd.appendChild(applyButton);
            jobAd.appendChild(applyFormContainer);

            jobsContainer.appendChild(jobAd);
        });
    };

    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredJobs = jobsData.filter(job => 
            job.title.toLowerCase().includes(searchTerm) || 
            job.libelle.toLowerCase().includes(searchTerm) ||
            job.city.toLowerCase().includes(searchTerm) ||
            job.country.toLowerCase().includes(searchTerm)
        );
        displayJobs(filteredJobs);
    });
});
