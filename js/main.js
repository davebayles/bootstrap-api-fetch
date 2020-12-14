function formatPhoneNumber(str) {
  //Filter only numbers from the input
  let cleaned = ('' + str).replace(/\D/g, '');

  //Check if the input is of correct length
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }

  return null;
}

(function () {
  'use strict';
  window.addEventListener(
    'load',
    function () {
      var forms = document.getElementsByClassName('needs-validation');
      var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener(
          'submit',
          function (event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            } else {
              getResults(event);
            }
            form.classList.add('was-validated');
          },
          false
        );
      });
    },
    false
  );
})();

function getResults(event) {
  event.preventDefault();
  let main = document.querySelector('#main');
  let search = document.querySelector('#search');
  let searchResults = document.querySelector('#results');
  let intro = document.querySelector('#intro');
  let loader = `<div class="boxLoading"></div>`;
  let phoneNumbers = '';
  document.querySelector('body').classList.add('toggle__loading');

  let email = document.getElementById('validationEmail').value;

  fetch(`https://ltv-data-api.herokuapp.com/api/v1/records.json?email=${email}`)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('HTTP error, status = ' + response.status);
      }
      return response.json();
    })
    .then(function (json) {
      json.phone_numbers.forEach(function (value, key) {
        phoneNumbers += `<li><a href="tel:${value}">${formatPhoneNumber(
          value
        )}</a></li>`;
      });

      searchResults.innerHTML = `
          <div class="container">
            <div class="row">
              <div class="col-12 text-center">
                <h1>1 Result</h1>
                <p class="intro__text">Look at the result below to see the details of the person you’re searched for.</p>
              </div>
              <div class="col-12">
                <div class="person">
                  <div class="row">
                    <div class="d-none d-md-block col-md-auto">
                      <div class="person__badge">
                        <img src="./assets/SVGs/icn_person.svg" />
                      </div>
                    </div>
                    <div class="col-12 col-md">
                      <div class="person__name">${json.first_name} ${json.last_name}</div>
                      <p>${json.description}</p>
                      <div class="row">
                        <div class="col-12 col-md-6">
                          <h4>Address</h4>
                          <p>${json.address}</p>

                          <h4>Email</h4>
                          <p>${json.email}</p>
                        </div>
                        <div class="col-12 col-md-6">
                          <h4>Phone Numbers</h4>
                          <ul>${phoneNumbers}</ul>

                          <h4>Relatives</h4>
                          <ul>
                            <li>Jane Smith</li>
                            <li>John Smith Jr</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  
                </div>
              </div>
            </div>
          </div>
          `;

      document.querySelector('body').classList.remove('toggle__loading');
      intro.classList.add('d-none');
      search.classList.add('active');
      searchResults.classList.remove('d-none');
    })
    .catch(function (error) {
      searchResults.innerHTML = `
          <div class="container">
            <div class="row">
              <div class="col-12 text-center no-results">
                <h1>0 Results</h1>
                <p class="intro__text">Try starting a new search below</p>
              </div>
            </div>
          </div>
          `;

      document.querySelector('body').classList.remove('toggle__loading');
      intro.classList.add('d-none');
      search.classList.add('active');
      searchResults.classList.remove('d-none');
    });
}
