import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { alertOptions } from './alertOptions.js';

const form = document.querySelector('.form');
const radioButtons = document.querySelectorAll('input[name="state"]');
const formFieldset = document.querySelector('fieldset');

const PRESSED = 'pressed';
const CHECKED = 'checked';
const FULFILLED = 'fulfilled';

function handleRadioChange(event) {
  const checkedLabel = document.querySelector('.checked');
  const isPressed = formFieldset.classList.value.includes(PRESSED);
  if (!isPressed) {
    formFieldset.classList.add(PRESSED);
  }
  if (checkedLabel) {
    checkedLabel.classList.remove(CHECKED);
  }
  const checkedRadio = document.querySelector('input[name="state"]:checked');
  if (checkedRadio) {
    const checkedLabel = checkedRadio.closest('label');
    if (checkedLabel) {
      checkedLabel.classList.add(CHECKED);
    }
  }
}

const onSubmit = event => {
  event.preventDefault();
  const delay = Number(event.target.elements.delay.value);
  const isFulfilled = event.target.elements.state.value === FULFILLED;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isFulfilled) {
        resolve(`Fulfilled promise in ${delay}ms`);
      } else {
        reject(`Rejected promise in ${delay}ms`);
      }
    }, delay);
  });

  promise
    .then(value => {
      iziToast.show({ ...alertOptions.success, message: value });
    })
    .catch(error => {
      iziToast.show({ ...alertOptions.error, message: error });
    });
};

form.addEventListener('submit', onSubmit);

radioButtons.forEach(radioButton => {
  radioButton.addEventListener('change', handleRadioChange);
});