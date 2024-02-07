import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dateTimeSelector = document.querySelector('input#datetime-picker');
const startTimerButton = document.querySelector('button[data-start]');
const daysInput = document.querySelector('span[data-days]');
const hoursInput = document.querySelector('span[data-hours]');
const minutesInput = document.querySelector('span[data-minutes]');
const secondsInput = document.querySelector('span[data-seconds]');

let userSelectedDate, timerId;

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
  daysInput.textContent = String(days).padStart(2, '0');
  hoursInput.textContent = String(hours).padStart(2, '0');
  minutesInput.textContent = String(minutes).padStart(2, '0');
  secondsInput.textContent = String(seconds).padStart(2, '0');
};

const startTimer = () => {
  timerId = setInterval(() => {
    const time = userSelectedDate - Date.now();

    if (time >= 0) {
      setDate(convertMs(time));
    } else {
      dateTimeSelector.disabled = false;
      clearInterval(timerId);
    }
  }, 1000);

  return timerId;
};

const initializePage = () => {
  // Вимкнення кнопки "Старт" при завантаженні сторінки
  startTimerButton.disabled = true;

  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const time = selectedDates[0].getTime() - Date.now();
      if (time > 0) {
        userSelectedDate = selectedDates[0];
        startTimerButton.disabled = false;
      } else {
        startTimerButton.disabled = true;
        iziToast.show({
          title: 'Error',
          message: 'Please choose a date in the future',
          color: '#EF4040',
          position: 'topRight',
          icon: 'icon-octagon',
          iconText: '',
          timeout: 5000,
          titleColor: '#fff',
          messageColor: '#fff',
          iconColor: '#fff',
        });
      }
    },
  };

  flatpickr(dateTimeSelector, options);
};

startTimerButton.addEventListener('click', () => {
  const time = userSelectedDate - Date.now();

  if (time > 0) {
    dateTimeSelector.disabled = true;
    startTimerButton.disabled = true;

    setDate(convertMs(time));
    startTimer();
  } else {
    iziToast.show({
      title: 'Error',
      message: 'Please choose a date in the future',
      color: '#EF4040',
      position: 'topRight',
      icon: 'icon-octagon',
      iconText: '',
      timeout: 5000,
      titleColor: '#fff',
      messageColor: '#fff',
      iconColor: '#fff',
    });
  }
});

// Ініціалізація сторінки
initializePage();
