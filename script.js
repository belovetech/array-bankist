'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Olayiwola Shukurat',
  movements: [430, 1000, 700, 50, 90, -150, -300],
  interestRate: 1.4,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// MOVEMENTS

// Display movements in the UI
const displayMovements = function (movements) {
  // Empty all the HTML element in the container
  containerMovements.innerHTML = '';

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterBegin', html);
  });
};

// CALCULATE AND DISPLAY BALANCE
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance}  €`;
};

// CALCULATE TOTAL DEPOSITS, WITHDRAWALS AND INTEREST
const calcDisplaySummary = function (account) {
  const totalDeposit = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = `${totalDeposit} €`;

  const totalWithdrawals = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumOut.textContent = `${Math.abs(totalWithdrawals)} €`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumInterest.textContent = `${interest.toFixed(2)} €`;
};

// CREATE USERNAME
const createUsername = function (accts) {
  accts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsername(accounts);

// UPDATE UI
const updateUI = function (account) {
  // Display movement
  displayMovements(account.movements);

  // Display balance
  calcDisplayBalance(currentAccount);

  // Display summary
  calcDisplaySummary(currentAccount);
};

let currentAccount;

// EVENT HANDLER FOR LOGIN
btnLogin.addEventListener('click', function (event) {
  // Prevent form from automatic submitting
  event.preventDefault();

  currentAccount = accounts.find(
    acct => acct.username === inputLoginUsername.value.toLowerCase()
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  } else {
    containerApp.style.opacity = 0;
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginUsername.focus();
    labelWelcome.textContent = `Incorrect username or password, Try again!`;
  }
});

// EVENT HANDLER FOR TRANSFER
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const receiverAcct = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);

  // Clear input fields
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    receiverAcct &&
    currentAccount.balance >= amount &&
    receiverAcct?.username !== currentAccount.username
  ) {
    // Initiate transfer
    currentAccount.movements.push(-amount);
    receiverAcct.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

// EVENT HANDLER FOR CLOSING ACCOUNT
btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const curIndex = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // DELETE ACCOUNT
    accounts.splice(curIndex, 1);

    // Hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Login to get started`;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

/*
const createUsername_ = function(user) {
   const username = user
  .toLowerCase()
  .split(' ')
  .map(name => name[0])
  .join('');
  return username;
}

accounts.forEach(acc => acc.username = createUsername_(acc.owner));
console.log(accounts);
*/
