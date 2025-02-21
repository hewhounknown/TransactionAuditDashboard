import { getPageUrl, fetchTransactions, approveTransaction, flagTransaction } from "./api.js";

function getStatusBadgeClass(status) {
    switch (status) {
        case "pending": return "bg-warning text-dark";
        case "completed": return "bg-success";
        case "failed": return "bg-danger";
        default: return "bg-secondary";
    }
}

async function loadTransactions(url = 'http://localhost:8000/api/transactions/') {
    const data = await fetchTransactions(url);

    let rows = data.results.map(
        (tx) => `
        <tr>
            <td>${tx.merchant}</td>
            <td>${tx.amount}</td>
            <td><span class="badge ${getStatusBadgeClass(tx.status)}">${tx.status}</span></td>
            <td><span class="badge ${tx.is_flagged ? "bg-danger" : "bg-secondary"}">${tx.is_flagged ? "Flagged" : "No"}</span></td>
            <td>${tx.approved_by ?? "-"}</td>
            <td>
              ${tx.status === "pending" ? `<button class="btn btn-sm btn-success approve-btn" data-code="${tx.code}">Approve</button>` : ""}
              <button class="btn btn-sm ${tx.is_flagged ? "btn-danger" : "btn-warning"} flag-btn" data-code="${tx.code}">${tx.is_flagged ? "Unflag" : "Flag"}</button>
            </td>
        </tr>`
    ).join('');

    document.querySelector("#transaction-table").innerHTML = rows || `<tr><td colspan="6" class="text-center text-muted">No transactions found.</td></tr>`;

    updatePaginationButtons(data.previous, data.next);
    attachEventListeners();
}

function updatePaginationButtons(previous, next){
    const prevBtn = document.querySelector("#prev-page");
    const nextBtn = document.querySelector("#next-page");
  
    prevBtn.disabled = !previous;
    nextBtn.disabled = !next;
  
    prevBtn.onclick = previous ? () => loadTransactions(getPageUrl(previous)) : null;
    nextBtn.onclick = next ? () => loadTransactions(getPageUrl(next)) : null;
}

function attachEventListeners() {
    document.querySelectorAll(".approve-btn").forEach((button) => {
        button.addEventListener("click", async (event) => {
            const code = event.target.getAttribute("data-code");
            if (await approveTransaction(code)) loadTransactions();
        });
    });
  
    document.querySelectorAll(".flag-btn").forEach((button) => {
        button.addEventListener("click", async (event) => {
            const code = event.target.getAttribute("data-code");
            if (await flagTransaction(code)) loadTransactions();
        });
    });
}


document.addEventListener("DOMContentLoaded", () => loadTransactions());
document.querySelector("#status-filter").addEventListener("change", () => loadTransactions());
document.querySelector("#merchant-search").addEventListener("input", () => loadTransactions());