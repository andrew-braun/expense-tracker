const balance = document.querySelector("#balance");
const balanceSign = document.querySelector("#balance-sign");
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
		amount: -400,
	},
	{
		id: 4,
		description: "Hijinks",
		amount: 75,
	},
];

let transactions = [...dummyTransactions];

/* Individual transaction processing */
function processTransaction(transaction) {
	/* Update state with transaction value */
	/* Detect positive/negative transaction sign and generate HTML list item */
	const sign = transaction.amount > 0 ? "+" : "-";

	/* Update state before rendering to minimize DOM changes when adding multiple transactions */
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
	return { sign: sign, item: newTransactionListItem, id: transaction.id };
}

function renderTransaction(transaction) {
	/* Process the transaction into a list item and render it to the DOM */
	const newTransaction = processTransaction(transaction);
	const item = document.createElement("li");
	item.tabIndex = "-1";
	item.classList.add("history-list-item");
	item.classList.add(newTransaction.sign === "+" ? "positive" : "negative");
	item.dataset.txid = newTransaction.id;
	item.innerHTML = newTransaction.item;
	historyList.appendChild(item);

	/* Add event listeners for mouse/focus events */
	item.addEventListener("mouseover", handleItemInteraction);
	item.addEventListener("mouseout", handleItemInteraction);
	item.addEventListener("click", handleItemInteraction);
	item.addEventListener("focusout", handleItemInteraction);
	item.querySelector(".delete-btn").addEventListener("click", handleItemDelete);
}

function resetAddTransaction() {
	transactionInputText.value = "";
	transactionInputAmount.value = 0;
}

function renderTransactionList(transactionList) {
	/* Render lis tof multiple transactions (on refresh/setup) */
	transactionList.map((transaction) => {
		renderTransaction(transaction);
	});
}

function updateValues() {
	/* Use values in state to render balance, income, and expenses */
	console.log(state);
	balanceSign.innerText = state.currentBalance < 0 ? "-" : "";
	balance.innerText = Math.abs(state.currentBalance).toFixed(2);
	positiveCash.innerText = state.currentIncome.toFixed(2);
	negativeCash.innerText = Math.abs(state.currentExpense).toFixed(2);
}

function init() {
	historyList.innerHTML = "";
	resetAddTransaction();
	renderTransactionList(dummyTransactions);
	updateValues();
}

init();

/* Handlers */
function handleTransactionSubmit(event) {
	/* Build a transaction object, add to local storage, and render it to the DOM */

	const transactionObject = {
		description: transactionInputText.value,
		amount: transactionInputAmount.value,
		id: transactions.length + 1,
	};

	renderTransaction(transactionObject);

	resetAddTransaction();

	transactions.push(transactionObject);
	console.log(transactions);
	updateValues();
}

function handleTransactionSignChange(event) {
	if (event.target === transactionButtonPositive) {
		transactionInputAmount.value = transactionInputAmount.value.replace(
			"-",
			""
		);
	} else if (event.target === transactionButtonNegative) {
		if (transactionInputAmount.value === "0") {
			transactionInputAmount.value = (0 - 0.1).toFixed();
		} else {
			transactionInputAmount.value = 0 - transactionInputAmount.value;
		}
	}
}

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

function handleItemDelete(event) {
	const listItem = event.target.closest(".history-list-item");

	const tx = transactions.find((tx) => tx.id === Number(listItem.dataset.txid));

	state.currentBalance -= tx.amount;
	if (tx.amount > 0) {
		state.currentIncome -= tx.amount;
	} else if (tx.amount < 0) {
		state.currentExpense -= tx.amount;
	}

	updateValues();

	listItem.remove();
}

/* Add event listeners to each history list item */
for (item of historyListItems) {
	item.addEventListener("mouseover", handleItemInteraction);
	item.addEventListener("mouseout", handleItemInteraction);
	item.addEventListener("click", handleItemInteraction);
	item.addEventListener("focusout", handleItemInteraction);
	item.querySelector(".delete-btn").addEventListener("click", handleItemDelete);
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
