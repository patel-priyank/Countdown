const inputContainer = document.querySelector('#input-container');
const countdownForm = document.querySelector('#countdown-form');
const datePicker = document.querySelector('#date-picker');

const countdownEl = document.querySelector('#countdown');
const countdownElTitle = document.querySelector('#countdown-title');
const countdownBtn = document.querySelector('#countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.querySelector('#complete');
const completeElInfo = document.querySelector('#complete-info');
const completeBtn = document.querySelector('#complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue;
let countdownActive;

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

// Populate countdown
const updateDOM = () => {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;

    const days = Math.floor(distance / DAY);
    const hours = Math.floor((distance % DAY) / HOUR);
    const minutes = Math.floor((distance % HOUR) / MINUTE);
    const seconds = Math.floor((distance % MINUTE) / SECOND);

    // Hide Input
    inputContainer.hidden = true;

    if (distance < 0) {
      // If countdown has ended, show complete
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      countdownEl.hidden = true;
      completeEl.hidden = false;
    } else {
      // Show countdown in progress
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${hours}`;
      timeElements[2].textContent = `${minutes}`;
      timeElements[3].textContent = `${seconds}`;
      countdownEl.hidden = false;
      completeEl.hidden = true;
    }
  }, SECOND);
};

// Set Date inout min to today's date
// const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
const tomorrow = new Date().toISOString().split('T')[0];
datePicker.setAttribute('min', tomorrow);

// Take values from form input
const updateCountdown = event => {
  event.preventDefault();
  countdownTitle = event.srcElement[0].value;
  countdownDate = event.srcElement[1].value;

  localStorage.setItem(
    'countdown',
    JSON.stringify({
      title: countdownTitle,
      date: countdownDate
    })
  );

  // Check for valid date
  if (countdownDate === '') {
    alert('Please select a date for the countdown!');
  } else {
    // Get number version of current Date and update DOM
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
};

// Reset all values
const reset = () => {
  // Hide countdown and show input
  inputContainer.hidden = false;
  countdownEl.hidden = true;
  completeEl.hidden = true;

  // Stop countdown
  clearInterval(countdownActive);

  // Reset values
  countdownTitle = '';
  countdownDate = '';
  localStorage.removeItem('countdown');
};

// Get countdown from localStorage if available
const restorePreviousCountdown = () => {
  if (localStorage.getItem('countdown')) {
    inputContainer.hidden = true;
    const savedCountdown = JSON.parse(localStorage.getItem('countdown'));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;

    // Get number version of current Date and update DOM
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
};

// Event Listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// On load
restorePreviousCountdown();
