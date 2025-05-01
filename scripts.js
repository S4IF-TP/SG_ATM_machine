"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Seifeddine Ghozzi",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 0o0,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayMovements = function (movements, sort = false) {
  // Clear the movements container before displaying new movements
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements; // Sort the movements if required
  // all we want is to sort the array and not change the original array so we copy the array using slice() and then sort it
  containerMovements.innerHTML = ""; // Clear existing movements
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} </div>
          <div class="movements__value">${mov} € </div>
        </div>
        `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance; // Store the balance in the account object
  labelBalance.textContent = `${balance}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts); // Create usernames for all accounts

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;
  const out = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;
  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposite) => (deposite * 1.2) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// Holds the currently logged-in account object
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault(); // Prevent form submission
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  ); // Find the account based on the username
  const enteredPin = Number(inputLoginPin.value);
  if (currentAccount?.pin === enteredPin) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    inputLoginUsername.value = ""; // Clear the username input field
    inputLoginPin.value = ""; // Clear the pin input field
    inputLoginUsername.value = inputLoginPin.value = ""; // Clear the input fields
    inputLoginPin.blur(); // Remove focus from the pin input
    containerApp.style.opacity = 100; // Show the app container
    displayMovements(currentAccount.movements);
    calcDisplayBalance(currentAccount); // Display the balance
    calcDisplaySummary(currentAccount); // Display the summary
  } else {
    labelWelcome.textContent = "Incorrect username or pin!";
    inputLoginUsername.value = ""; // Clear the username input field
    inputLoginPin.value = ""; // Clear the pin input field
    inputLoginUsername.value = inputLoginPin.value = ""; // Clear the input fields
    inputLoginPin.blur(); // Remove focus from the pin input
    containerApp.style.opacity = 0; // Hide the app container
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault(); // Prevent form submission when we work with forms
  const amount = Number(inputTransferAmount.value); // Get the transfer amount
  const receiverAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  ); // Find the receiver's account
  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiverAccount &&
    receiverAccount.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount); // Deduct the amount from the sender's account
    receiverAccount.movements.push(amount); // Add the amount to the receiver's account
    displayMovements(currentAccount.movements); // Display the updated movements
    calcDisplayBalance(currentAccount); // Update and display the balance
    calcDisplaySummary(currentAccount); // Update and display the summary
    inputTransferAmount.value = inputTransferTo.value = ""; // Clear the input fields
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault(); // Prevent form submission
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1); // Remove the account from the accounts array
    containerApp.style.opacity = 0; // Hide the app container
  }
  inputCloseUsername.value = inputClosePin.value = ""; // Clear the input fields
});
btnLoan.addEventListener("click", function (e) {
  e.preventDefault(); // Prevent form submission
  const amount = Number(inputLoanAmount.value); // Get the loan amount
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount); // Add the loan amount to the account
    displayMovements(currentAccount.movements); // Display the updated movements
    calcDisplayBalance(currentAccount); // Update and display the balance
    calcDisplaySummary(currentAccount); // Update and display the summary
    inputLoanAmount.value = ""; // Clear the input field
  }
});
let sorted = false; // Variable to track the sorting state
btnSort.addEventListener("click", function (e) {
  e.preventDefault(); // Prevent form submission
  sorted = !sorted; // Toggle the sorting state
  displayMovements(currentAccount.movements, sorted); // Display the movements in sorted order
});
