// Get references to elements
const fromSelect = document.getElementById("from-dropdown");
const toSelect = document.getElementById("to-dropdown");
const jp_submit_btn = document.querySelector('button#jpSubmit');
const loading_spinner = document.querySelector("#loading_circle_spinner");

let from_field_filled = false;
let to_field_filled = false;

// Subject class for the Observer pattern
class FormSubject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  notifyObservers() {
    this.observers.forEach((observer) => observer.update());
  }
}

// Observer classes
class FormValidator {
  constructor(formSubject) {
    this.formSubject = formSubject;
    this.formSubject.addObserver(this);
  }

  update() {
    if (from_field_filled && to_field_filled) {
      jp_submit_btn.removeAttribute('disabled');
      jp_submit_btn.style.cursor = "pointer";
    } else {
      jp_submit_btn.setAttribute('disabled', '');
      jp_submit_btn.style.cursor = "default";
    }
  }
}

class LoadingSpinnerUpdater {
  constructor(formSubject) {
    this.formSubject = formSubject;
    this.formSubject.addObserver(this);
  }

  update() {
    // Existing UI update logic for loading spinner
    loading_spinner.style.display = "block";
    toSelect.setAttribute("disabled", "");

    setTimeout(() => {
      loading_spinner.style.display = "none";
      toSelect.style.cursor = 'pointer';
      toSelect.removeAttribute("disabled");
    }, 1500);
  }
}

// Usage
const formSubject = new FormSubject();
const formValidator = new FormValidator(formSubject);
const loadingSpinnerUpdater = new LoadingSpinnerUpdater(formSubject);

// Add an event listener to the from select element
fromSelect.addEventListener("change", function () {
  // Get the selected from option and its optgroup label
  const from_selectedOption = this.options[this.selectedIndex];
  const from_selectedOptionLabel = from_selectedOption.parentElement;

  // Notify observers about the change
  formSubject.notifyObservers();
});

// Check if to field is not empty
toSelect.addEventListener('change', () => {
  // Existing logic for updating to_field_filled

  // Notify observers about the change
  formSubject.notifyObservers();
});