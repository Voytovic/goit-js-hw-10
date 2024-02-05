import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const userSelectedDate = selectedDates[0];

    if (userSelectedDate < new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      toggleStartButton(false);
    } else {
      toggleStartButton(true);
    }
  },
};

const datePicker = flatpickr("#datetime-picker", options);

let countdownInterval;
let userSelectedDate;

function toggleStartButton(enabled) {
  const startButton = document.querySelector('[data-start]');
  startButton.disabled = !enabled;
}

function updateTimerInterface(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);
}

function startTimer() {
  const currentTime = new Date().getTime();
  const timeDifference = userSelectedDate - currentTime;

  if (timeDifference > 0) {
    countdownInterval = setInterval(() => {
      updateTimerInterface(timeDifference);

      if (timeDifference <= 0) {
        clearInterval(countdownInterval);
        toggleStartButton(true);
        iziToast.success({
          title: 'Countdown Complete',
          message: 'The countdown has reached zero!',
        });
      }

      timeDifference -= 1000; // Subtract one second
    }, 1000);

    toggleStartButton(false);
  }
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value < 10 ? `0${value}` : value;
}

document.querySelector('#datetime-picker').addEventListener('click', () => {
  datePicker.open();
});

document.querySelector('[data-start]').addEventListener('click', () => {
  userSelectedDate = datePicker.selectedDates[0];
  startTimer();
});
