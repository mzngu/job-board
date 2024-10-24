const offerEndpoint = 'http://127.0.0.1:5501/offer';

document.addEventListener('DOMContentLoaded', () => {
    const jobsContainer = document.getElementById('jobs-container');
    const searchBar = document.getElementById('search-bar');
    const suggestionsContainer = document.getElementById('suggestions');
    const searchButton = document.getElementById('search-button');
    
    let jobsList = [];

    fetchOffers();

    searchBar.addEventListener('keyup', () => {
        const keyword = searchBar.value.toLowerCase();
        if (keyword === "") {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const suggestions = jobsList.filter(job => 
            job.title.toLowerCase().includes(keyword) || 
            job.libelle.toLowerCase().includes(keyword)
        );

        displaySuggestions(suggestions);
    });

    searchBar.addEventListener('input', () => {
        if (searchBar.value === "") {
            suggestionsContainer.style.display = 'none';
        }
    });

    searchButton.addEventListener('click', () => {
        const keyword = searchBar.value.toLowerCase();
        const filteredJobs = jobsList.filter(job => 
            job.title.toLowerCase().includes(keyword) || 
            job.libelle.toLowerCase().includes(keyword)
        );

        displayJobs(filteredJobs);
        suggestionsContainer.style.display = 'none';
    });

    function fetchOffers() {
        fetch(offerEndpoint)
            .then(response => response.json())
            .then(data => {
                jobsList = data; 
                displayJobs(jobsList);
            })
            .catch(error => {
                console.error("Failed to fetch job data:", error);
            });
    }

    function displayJobs(jobs) {
        jobsContainer.innerHTML = ''; 
        jobs.forEach(job => {
            const jobAd = createJobAd(job);
            jobsContainer.appendChild(jobAd);
        });
    }

    function displaySuggestions(jobs) {
        suggestionsContainer.innerHTML = '';

        if (jobs.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const ul = document.createElement('ul');
        jobs.forEach(job => {
            const li = document.createElement('li');
            li.textContent = job.title;
            li.onclick = () => {
                searchBar.value = job.title;
                suggestionsContainer.style.display = 'none';
                displayJobs([job]);
            };
            ul.appendChild(li);
        });

        suggestionsContainer.appendChild(ul);
        suggestionsContainer.style.display = 'block';
    }

    function createJobAd(job) {
        const jobAd = document.createElement('div');
        jobAd.classList.add('job-ad', 'col-md-6');

        const jobTitle = document.createElement('h2');
        jobTitle.classList.add('job-title');
        jobTitle.textContent = job.title;

        const jobDescription = document.createElement('p');
        jobDescription.classList.add('job-description');
        jobDescription.textContent = job.libelle;

        const jobDetails = document.createElement('ul');
        jobDetails.classList.add('job-details');
        jobDetails.style.display = 'none';
        
        const details = [
            `Job Type: ${job.jobType}`,
            `Working Time: ${job.workingTime}`,
            `Contract Type: ${job.contractType}`,
            `Salary: ${job.salary}`,
            `Location: ${job.city}, ${job.country}`,
            `Address: ${job.adress} - ${job.zipCode}`
        ];
        
        details.forEach(detail => {
            const li = document.createElement('li');
            li.textContent = detail;
            jobDetails.appendChild(li);
        });

        const learnMoreButton = document.createElement('button');
        learnMoreButton.classList.add('learn-more');
        learnMoreButton.textContent = 'Learn More';
        learnMoreButton.onclick = () => {
            if (jobDetails.style.display === 'none') {
                jobDetails.style.display = 'block';
                learnMoreButton.textContent = 'Hide Details';
            } else {
                jobDetails.style.display = 'none';
                learnMoreButton.textContent = 'Learn More';
            }
        };

        const applyButton = document.createElement('button');
        applyButton.classList.add('apply');
        applyButton.textContent = 'Apply';
        applyButton.onclick = () => {
            const existingForm = jobAd.querySelector('.application-form');
            if (existingForm) {
                existingForm.remove();
            } else {
                const applicationForm = createApplicationForm(job.title);
                jobAd.appendChild(applicationForm);
            }
        };

        jobAd.appendChild(jobTitle);
        jobAd.appendChild(jobDescription);
        jobAd.appendChild(jobDetails);
        jobAd.appendChild(learnMoreButton);
        jobAd.appendChild(applyButton);

        return jobAd;
    }

    function createApplicationForm(jobTitle) {
        const form = document.createElement('form');
        form.classList.add('application-form');
        
        const motivationInput = document.createElement('textarea');
        motivationInput.placeholder = `Write your motivation letter for ${jobTitle}`;
        
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Submit Application';
        
        form.appendChild(motivationInput);
        form.appendChild(submitButton);

        form.onsubmit = (event) => {
            event.preventDefault();
            alert(`Application submitted for ${jobTitle}`);
            form.remove();
        };

        return form;
    }
});
