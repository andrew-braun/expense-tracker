const balance = document.querySelector("#balance");
const positiveCash = document.querySelector("#income-amount");
const negativeCash = document.querySelector("#expense-amount");

const historyList = document.querySelector("#history-list");
const historyListItems = document.querySelectorAll(".history-list-item");

const transactionButtonPositive = document.querySelector(
	".transaction-button-positive"
);
const transactionButtonNegative = document.querySelector(
	".transaction-button-negative"
);
const transactionInputText = document.querySelector("#transaction-input-text");
const transactionInputAmount = document.querySelector(
	"#transaction-input-amount"
);
const transactionSubmit = document.querySelector(".transaction-submit-button");

/* State management */
const state = {
	currentBalance: Number.parseFloat(balance.innerText),
	currentIncome: Number.parseFloat(positiveCash.innerText),
	currentExpense: Number.parseFloat(negativeCash.innerText),
};

console.log(state);

const dummyTransactions = [
	{
		id: 1,
		description: "Puppy",
		amount: -100,
	},
	{
		id: 2,
		description: "Heist",
		amount: 1000,
	},
	{
		id: 3,
		description: "Vet Bills",
		amount: 400,
	},
	{
		id: 4,
		description: "Hijinks",
		amount: -75,
	},
];

let transactions = dummyTransactions;

function handleTransactionSignChange(event) {
	if (event.target === transactionButtonPositive) {
		transactionInputAmount.value = transactionInputAmount.value.replace(
			"-",
			""
		);
	} else if (event.target === transactionButtonNegative) {
		transactionInputAmount.value = 0 - transactionInputAmount.value;
	}
}

function processTransaction(transaction) {
	/* Update state with transaction value */
	/* Detect positive/negative transaction sign and generate HTML list item */
	const sign = transaction.amount > 0 ? "+" : "-";
	console.log(transaction.amount);
	state.currentBalance += Number.parseFloat(transaction.amount);
	if (sign === "+") {
		state.currentIncome += Number.parseFloat(transaction.amount);
	} else if (sign === "-") {
		state.currentExpense += Number.parseFloat(transaction.amount);
	}

	const newTransactionListItem = `
        <span class="history-list-item__text">
            <span class="history-list-item__amount">${sign} ${Math.abs(
		transaction.amount
	)}</span>
            <span class="history-list-item__label">${
							transaction.description
						}</span>
        </span>
        <button class="delete-btn">X</button>
`;
	return { sign: sign, item: newTransactionListItem };
}

function renderTransaction(transaction) {
	/* Process the transaction into a list item and render it to the DOM */
	const newTransaction = processTransaction(transaction);
	const item = document.createElement("li");
	item.tabIndex = "-1";
	item.classList.add("history-list-item");
	item.classList.add(newTransaction.sign === "+" ? "positive" : "negative");
	item.innerHTML = newTransaction.item;
	historyList.appendChild(item);

	/* Add event listeners for mouse/focus events */
	item.addEventListener("mouseover", handleItemInteraction);
	item.addEventListener("mouseout", handleItemInteraction);
	item.addEventListener("click", handleItemInteraction);
	item.addEventListener("focusout", handleItemInteraction);
}

function renderTransactionList(transactionList) {
	transactionList.map((transaction) => {
		renderTransaction(transaction);
	});
}

function resetAddTransaction() {
	transactionInputText.value = "";
	transactionInputAmount.value = 0;
}

function handleTransactionSubmit(event) {
	/* Build a transaction object, add to local storage, and render it to the DOM */

	const transactionObject = {
		description: transactionInputText.value,
		amount: transactionInputAmount.value,
	};

	renderTransaction(transactionObject);

	resetAddTransaction();

	updateValues();
}

function setBalanceState() {
	state.currentBalance = Number.parseFloat(balance.innerText);
	state.currentIncome = Number.parseFloat(positiveCash.innerText);
	state.currentExpense = Number.parseFloat(negativeCash.innerText);
}

function updateValues() {
	console.log(state);
	balance.innerText = state.currentBalance.toFixed(2);
	positiveCash.innerText = state.currentIncome.toFixed(2);
	negativeCash.innerText = state.currentExpense.toFixed(2);
}

function init() {
	historyList.innerHTML = "";
	resetAddTransaction();
	renderTransactionList(dummyTransactions);
	updateValues();
}

init();

function handleItemInteraction(event) {
	/* Handle any interaction with history list item */
	const listItem = event.target.closest(".history-list-item");
	const deleteButton = listItem.querySelector(".delete-btn");

	/* Show/hide delete button on hover/focus events */

	if (event.type === "mouseover") {
		deleteButton.classList.add("visible");
	} else if (event.type === "mouseout" && document.activeElement !== listItem) {
		deleteButton.classList.remove("visible");
	} else if (event.type === "click") {
		listItem.focus();
	} else if (event.type === "focusout") {
		deleteButton.classList.remove("visible");
	}
}

/* Add event listeners to each history list item */
for (item of historyListItems) {
	item.addEventListener("mouseover", handleItemInteraction);
	item.addEventListener("mouseout", handleItemInteraction);
	item.addEventListener("click", handleItemInteraction);
	item.addEventListener("focusout", handleItemInteraction);
}

transactionButtonPositive.addEventListener(
	"click",
	handleTransactionSignChange
);
transactionButtonNegative.addEventListener(
	"click",
	handleTransactionSignChange
);

transactionSubmit.addEventListener("click", handleTransactionSubmit);
