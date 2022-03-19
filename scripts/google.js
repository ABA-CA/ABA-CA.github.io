// Client ID and API key
// Allows you to use google API
var CLIENT_ID = '217647880824-ot6cfpn1vnoa012lcsuacsct6vkk0qj2.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBQMvZUeeyezuXdcBBCmBVZDOiiDFeVTfs';

// Version of the Google Api you are using
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes ~ What your APIs are allowed to access
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

// Gets authorize Button from html page
var authorizeButton = document.getElementById('authorize_button');
// Gets signout Button from html page
var signoutButton = document.getElementById('signout_button');

/**
 *  Loads API helper
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 *  Creates the Google API class and calls sign in
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function (data) {
    // Listen for sign-in state changes.
    console.log('some-data', data);
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function (error) {
    console.log(error);
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none'; // hide auth button
    signoutButton.style.display = 'block'; // show sign out button
    updateSheet();
  } else {
    authorizeButton.style.display = 'block'; // show auth button
    signoutButton.style.display = 'none'; // hide sign out button
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1nkvk4K0k7ZU2MEh_8Yt7Tb1Q6zUqKbaorR7cOaM_RUY/edit
 */
function updateSheet(values) {
  if (values == null) return;

  // Get all the data from the sheets
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1nkvk4K0k7ZU2MEh_8Yt7Tb1Q6zUqKbaorR7cOaM_RUY',
    range: 'Class Data!A2:L200',
  }).then(function (response) {
    var range = response.result;
    range.values.push(values);

    // This will update the sheet with the form data you put in.
    gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: '1nkvk4K0k7ZU2MEh_8Yt7Tb1Q6zUqKbaorR7cOaM_RUY',
      range: 'Class Data!A2:L200',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: range.values,
      }
    }).then(function (response) {
      console.log(response);
      document.getElementById('form').style.display = 'none';
      document.getElementById('thank-you').style.display = 'block';
    });
  }, function (response) {
    console.log(response);
  });

}

// SUBMIT FORM
document.getElementById("submit").onclick = () => {

  // check values
  const check = checkAllValues();
  if (check.error) {
    alert(check.message) // alert if there are errors
    return;
  }
  console.log(check.values);
  updateSheet(check.values); // successful then update google sheet
  console.log(check);
}

// Checks the form if they completed it. If its not completed it will alert the page
function checkAllValues() {
  const classValue = document.querySelector('input[name="Class"]:checked');
  const fname = document.getElementById('fname').value;
  const lname = document.getElementById('lname').value;
  const gender = document.getElementById('gender').value;
  const DOB = document.getElementById('DOB').value;
  const schoolYear = document.getElementById('school-year').value;
  const emiratesId = document.getElementById('emiratesId').value;
  const vaccine1 = document.querySelector('input[name="vaccine#1"]:checked')
  const vaccine2 = document.querySelector('input[name="vaccine#2"]:checked')
  const otherExplanation = document.getElementById('otherExplanation').value;
  const datevaccine1 = document.getElementById('datevaccine1').value;
  const datevaccine2 = document.getElementById('datevaccine2').value;
  const datevaccineb = document.getElementById('datevaccineb').value;


  let errorMessage = 'You Forgot The Following Fields: '
  let isError = false;
  if (!classValue) {
    errorMessage += '(class) '
    isError = true;
  }
  if (!fname) {
    errorMessage += '(first name) '
    isError = true;
  }
  if (!lname) {
    errorMessage += '(last name) '
    isError = true;
  }
  if (!gender) {
    errorMessage += '(gender) '
    isError = true;
  }
  if (!DOB) {
    errorMessage += '(date of birth)'
    isError = true;
  }
  if (!schoolYear) {
    errorMessage += '(school-year)'
    isError = true;
  }
  if (!emiratesId) {
    errorMessage += '(emiratesId)'
    isError = true;
  }
  if (!vaccine1) {
    errorMessage += '(vaccine1)'
    isError = true;
  }
  else if (!vaccine2) {
    errorMessage += '(vaccine2)'
    isError = true;
  }
  else if ((vaccine1.value == 'other' || vaccine2.value == 'other') && !otherExplanation) {
    errorMessage += '(other)'
    isError = true;
  }
  if (!datevaccine1) {
    errorMessage += '(datevaccine1)'
    isError = true;
  }
  if (!datevaccine2) {
    errorMessage += '(datevaccine2)'
    isError = true;
  }
  if (!datevaccineb) {
    errorMessage += '(datevaccineb)'
    isError = true;
  }

  return {
    error: isError,
    message: errorMessage,
    values: [
      fname,
      lname,
      classValue.value,
      gender,
      DOB,
      schoolYear,
      emiratesId,
      vaccine1.value,
      vaccine2.value,
      datevaccine1,
      datevaccine2,
      datevaccineb,
    ]
  };
}
