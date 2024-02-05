import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// =================================================================
const inputCalendar = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start');
const timerRefs = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};
// =========================================================
let userSelectedDate = null;
startBtn.setAttribute('disabled', 'true');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    if (selectedDates[0].getTime() < Date.now()) {
      startBtn.setAttribute('disabled', 'true');
      iziToast.error({
        position: 'topRight',
        message: 'Please choose a date in the future',
      });
    } else {
      userSelectedDate = selectedDates[0];
      startBtn.removeAttribute('disabled');
    }
  },
};

flatpickr('#datetime-picker', options);
startBtn.addEventListener('click', onBtnStartClick);

function onBtnStartClick() {
  startBtn.setAttribute('disabled', 'true');
  const intervslId = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = userSelectedDate.getTime() - currentTime;
    if (deltaTime > 0) {
      inputCalendar.setAttribute('disabled', 'true');
      const { days, hours, minutes, seconds } = convertMs(deltaTime);
      timerRefs.days.textContent = days;
      timerRefs.hours.textContent = hours;
      timerRefs.minutes.textContent = minutes;
      timerRefs.seconds.textContent = seconds;
    } else {
      clearInterval(intervslId);
      inputCalendar.removeAttribute('disabled');
    }
  }, 1000);
}
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}