
let participants = [];
let expenses = [];

function addParticipant() {
  const name = document.getElementById("participantName").value.trim();
  if (!name || participants.includes(name)) return;
  participants.push(name);
  document.getElementById("participantName").value = "";
  updateParticipantList();
  updateExpenseForm();
}

function updateParticipantList() {
  const list = document.getElementById("participantList");
  list.innerHTML = "";
  participants.forEach(name => {
    const li = document.createElement("li");
    const input = document.createElement("input");
    input.value = name;
    input.onchange = () => {
      const idx = participants.indexOf(name);
      participants[idx] = input.value.trim();
      updateParticipantList();
      updateExpenseForm();
    };
    li.appendChild(input);
    list.appendChild(li);
  });
}

function updateExpenseForm() {
  const container = document.getElementById("expenseParts");
  container.innerHTML = "";
  participants.forEach(name => {
    const label = document.createElement("label");
    label.textContent = name + ": ";
    const input = document.createElement("input");
    input.type = "number";
    input.min = 0;
    input.value = 1;
    input.dataset.name = name;
    label.appendChild(input);
    container.appendChild(label);
  });
}

function addExpense() {
  const desc = document.getElementById("expenseDesc").value.trim();
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  const error = document.getElementById("expenseError");
  if (!desc || isNaN(amount) || amount <= 0) {
    error.textContent = "Description ou montant invalide.";
    return;
  }
  const parts = {};
  let valid = true;
  let totalParts = 0;
  document.querySelectorAll("#expenseParts input").forEach(input => {
    const val = parseFloat(input.value);
    if (isNaN(val) || val < 0) valid = false;
    parts[input.dataset.name] = val;
    totalParts += val;
  });
  if (!valid || totalParts === 0) {
    error.textContent = "Les parts doivent être valides et supérieures à zéro.";
    return;
  }
  expenses.push({ desc, amount, parts });
  document.getElementById("expenseDesc").value = "";
  document.getElementById("expenseAmount").value = "";
  updateExpenseList();
  error.textContent = "";
}

function updateExpenseList() {
  const list = document.getElementById("expenseList");
  list.innerHTML = "";
  expenses.forEach((exp, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${exp.desc}</strong> – ${exp.amount.toFixed(2)} €`;
    list.appendChild(li);
  });
}

function calculateBalances() {
  const balances = {};
  participants.forEach(p => balances[p] = 0);

  expenses.forEach(exp => {
    const totalParts = Object.values(exp.parts).reduce((sum, p) => sum + p, 0);
    Object.entries(exp.parts).forEach(([name, part]) => {
      const share = exp.amount * (part / totalParts);
      balances[name] -= share;
    });
  });

  const summary = Object.entries(balances)
    .map(([name, balance]) => {
      const rounded = balance.toFixed(2);
      if (balance < 0) return `${name} doit ${Math.abs(rounded)} €`;
      if (balance > 0) return `${name} reçoit ${rounded} €`;
      return `${name} est à l'équilibre`;
    }).join('<br>');

  document.getElementById("balanceSummary").innerHTML = summary;
}
