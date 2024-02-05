import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

document.querySelector('.form').addEventListener('submit', function (event) {
  event.preventDefault();

  const delayInput = document.querySelector('[name="delay"]');
  const stateInput = document.querySelector('[name="state"]:checked');

  const delay = parseInt(delayInput.value, 10);
  const state = stateInput ? stateInput.value : '';

  if (isNaN(delay) || delay <= 0) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a valid positive delay value.',
    });
    return;
  }

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else if (state === 'rejected') {
        reject(delay);
      }
    }, delay);
  });

  promise.then((value) => {
    iziToast.success({
      title: 'Fulfilled Promise',
      message: `✅ Fulfilled promise in ${value}ms`,
    });
  }).catch((value) => {
    iziToast.error({
      title: 'Rejected Promise',
      message: `❌ Rejected promise in ${value}ms`,
    });
  });
});
