const balance = document.querySelector("#balance");
const positiveCash = document.querySelector(
	"#positive-cash .income-expense-container__amount"
);
const negativeCash = document.querySelector(
	"#negative-cash .income-expense-container__amount"
);

const historyList = document.querySelector("#history-list");
const historyListItems = document.querySelectorAll(".history-list-item");

const transactionButtonPositive = document.querySelector(
	".transaction-button-positive"
);
const transactionButtonNegative = document.querySelector(
	".transaction-button-negative"
);
const descriptionInput = document.querySelector("#description-input");
const transactionInputAmount = document.querySelector(
	"#transaction-input-amount"
);

/* State management */
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
	console.log(event.target);
	console.log(transactionButtonPositive);
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
	/* Detect positive/negative transaction sign and generate HTML list item */
	const sign = transaction.amount > 0 ? "+" : "-";
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

	console.log(item);
}

function renderTransactionList(transactionList) {
	transactionList.map((transaction) => {
		renderTransaction(transaction);
	});
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

function init() {
	historyList.innerHTML = "";
	renderTransactionList(dummyTransactions);
}

init();

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
