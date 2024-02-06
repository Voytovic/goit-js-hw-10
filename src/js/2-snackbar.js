import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { alertOptions } from './alertOptions.js';

const form = document.querySelector('.form');
const radioButtons = document.querySelectorAll('input[name="state"]');
const formFieldset = document.querySelector('fieldset');

const PRESSED = 'pressed';
const CHECKED = 'checked';
const FULFILLED = 'fulfilled';

const handleRadioChange = () => {
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
  const delayInput = event.target.elements.delay;
  const stateInput = event.target.elements.state;

  const delay = Number(delayInput.value);
  const isFulfilled = stateInput.value === FULFILLED;

  const handlePromise = (delay, isFulfilled) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (isFulfilled) {
          resolve(`Fulfilled promise in ${delay}ms`);
        } else {
          reject(`Rejected promise in ${delay}ms`);
        }
      }, delay);
    });
  };

  const handleSuccess = value => {
    iziToast.show({ ...alertOptions.success, message: value });
  };

  const handleError = error => {
    iziToast.show({ ...alertOptions.error, message: error });
  };

  handlePromise(delay, isFulfilled)
    .then(handleSuccess)
    .catch(handleError);
};

form.addEventListener('submit', onSubmit);

radioButtons.forEach(radioButton => {
  radioButton.addEventListener('change', handleRadioChange);
});
