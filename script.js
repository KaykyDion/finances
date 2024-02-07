function renderTransaction(transactionData) {
  const transaction = document.createElement("div");
  transaction.classList.add("transaction");
  transaction.id = `transaction-${transactionData.id}`;

  const transactionId = document.createElement("p");
  transactionId.classList.add("transaction_id");
  transactionId.textContent = `#${transactionData.id}`;

  const transactionName = document.createElement("p");
  transactionName.classList.add("transaction_name");
  transactionName.textContent = `${transactionData.name}`;

  const transactionValue = document.createElement("p");
  transactionValue.classList.add("transaction_value");
  transactionValue.textContent = `R$ ${transactionData.value}`;

  const btnDiv = document.createElement("div");

  const editBtn = document.createElement("button");
  editBtn.classList.add("transaction_edit-btn");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", async () => {
    openModal();
    document.querySelector(
      "#transaction-to-edit"
    ).textContent = `Name: ${transactionName.textContent} | Value: ${transactionValue.textContent}`;

    const editForm = document.querySelector("#edit-form");
    editForm.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const newName = document.querySelector("#edit-name-input").value;
      const newValue = document.querySelector("#edit-value-input").value;

      transactionName.textContent = newName;
      transactionValue.textContent = `R$ ${newValue}`;

      const newTransactionData = {
        name: newName,
        value: newValue,
      };

      const response = await fetch(
        `http://localhost:3000/transactions/${transactionData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(newTransactionData),
        }
      );

      calculateBalance();
    });
  });

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("transaction_remove-btn");
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", async () => {
    const response = await fetch(
      `http://localhost:3000/transactions/${transaction.id.slice(12)}`,
      {
        method: "DELETE",
      }
    );

    document.querySelector(`#${transaction.id}`).remove();
    calculateBalance();
  });

  btnDiv.append(editBtn, removeBtn);

  transaction.append(transactionId, transactionName, transactionValue, btnDiv);
  document.querySelector(".transactions_list").append(transaction);
}

const transactionForm = document.querySelector(".transaction-form");

transactionForm.addEventListener("submit", async (ev) => {
  ev.preventDefault();

  const transactionData = {
    value: document.querySelector("#transaction-form_input-value").value,
    name: document.querySelector("#transaction-form_input-name").value,
  };

  const response = await fetch("http://localhost:3000/transactions", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(transactionData),
  });

  const savedTransaction = await response.json();
  transactionForm.reset();
  renderTransaction(savedTransaction);

  calculateBalance();
});

async function fetchTransactions() {
  const transactions = await fetch("http://localhost:3000/transactions").then(
    (res) => res.json()
  );

  transactions.forEach(renderTransaction);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchTransactions();
  calculateBalance();
});

async function calculateBalance() {
  const transactions = await fetch("http://localhost:3000/transactions").then(
    (res) => res.json()
  );

  const balance = transactions.reduce(
    (value, transaction) => (value += Number(transaction.value)),
    0
  );

  document.querySelector("#total-balance").textContent = `R$ ${balance},00`;
}

closeModal();

import { openModal, closeModal } from "./modal.js";
