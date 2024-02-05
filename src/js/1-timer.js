import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { alertOptions } from './alertOptions.js';

const dateTimeSelector = document.querySelector('input#datetime-picker');
const startTimerButton = document.querySelector('button[data-start]');
const daysInput = document.querySelector('span[data-days]');
const hoursInput = document.querySelector('span[data-hours]');
const minutesInput = document.querySelector('span[data-minutes]');
const secondsInput = document.querySelector('span[data-seconds]');

let userSelectedDate, timerId;

const countLeftTime = date => {
  const dateNow = Math.floor(Date.now() / 1000);
  const selectedDate = date.getTime() / 1000;
  return (selectedDate - dateNow) * 1000;
};

const convertMs = ms => {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
};

const setDate = ({ days, hours, minutes, seconds }) => {
  daysInput.textContent = String(days).padStart(2, 0);
  hoursInput.textContent = String(hours).padStart(2, 0);
  minutesInput.textContent = String(minutes).padStart(2, 0);
  secondsInput.textContent = String(seconds).padStart(2, 0);
};

const startTimer = time => {
  return () => {
    time -= 1000;
    if (time >= 0) {
      setDate(convertMs(time));
    } else {
      dateTimeSelector.disabled = false;
      clearInterval(timerId);
    }
  };
};

startTimerButton.addEventListener('click', () => {
  const time = countLeftTime(userSelectedDate);
  startTimerButton.disabled = true;

  if (time > 0) {
    dateTimeSelector.disabled = true;
    setDate(convertMs(time));
    timerId = setInterval(startTimer(time), 1000);
  } else {
    iziToast.show(alertOptions.error);
  }
});

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (countLeftTime(selectedDates[0]) > 0) {
      userSelectedDate = selectedDates[0];
      startTimerButton.disabled = false;
    } else {
      startTimerButton.disabled = true;
      iziToast.show(alertOptions.error);
    }
  },
};

flatpickr(dateTimeSelector, options);