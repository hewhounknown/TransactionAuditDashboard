const baseUrl = "http://localhost:8000/api/transactions/";
let currentPageUrl = baseUrl;


function displayTransactions(data) {
  const transactionTable = document.querySelector("#transaction-table");
  const noDataMessage = document.querySelector("#no-data-message");

  if (data.results.length === 0) {
    transactionTable.innerHTML = "";
    noDataMessage.style.display = "block"; 
  } else {
    const rows = data.results
      .map((tx) => {

        let statusBadgeClass = '';
        if (tx.status === 'completed') {
          statusBadgeClass = 'bg-primary';
        } else if (tx.status === 'pending') {
          statusBadgeClass = 'bg-warning';
        } else if (tx.status === 'failed') {
          statusBadgeClass = 'bg-danger';
        }

        const flaggedBadgeClass = tx.is_flagged ? 'bg-warning' : 'bg-secondary';

        return `
        <tr>
          <td>${tx.merchant}</td>
          <td>${tx.amount}</td>
          <td><span class="badge ${statusBadgeClass} text-white">${tx.status}</span></td>
          <td><span class="badge ${flaggedBadgeClass} text-white">${tx.is_flagged ? "Yes" : "No"}</span></td>
          <td>${tx.approved_by ?? "-"}</td>
        </tr>`;
      })
      .join("");
    transactionTable.innerHTML = rows;
    noDataMessage.style.display = "none"; 
  }
}


function displayPagination(data) {
  const prevBtn = document.querySelector("#prev-page");
  const nextBtn = document.querySelector("#next-page");

  if (data.previous) {
    prevBtn.disabled = false;
    prevBtn.onclick = function () {
      currentPageUrl = getPageUrl(data.previous);
      loadTransactions(currentPageUrl);
    };
  } else {
    prevBtn.disabled = true;
    prevBtn.onclick = null;
  }

  if (data.next) {
    nextBtn.disabled = false;
    nextBtn.onclick = function () {
      currentPageUrl = getPageUrl(data.next);
      loadTransactions(currentPageUrl);
    };
  } else {
    nextBtn.disabled = true;
    nextBtn.onclick = null;
  }
}

function filterByStatus() {
  currentPageUrl = baseUrl;
  loadTransactions(currentPageUrl);
}


function searchByMerchant() {
  currentPageUrl = baseUrl;
  loadTransactions(currentPageUrl);
}

function buildUrl() {
  const status = document.querySelector("#status-filter").value.toLowerCase();
  const merchantSearch = document.querySelector("#merchant-search").value.toLowerCase();
  const parsedUrl = new URL(baseUrl);

  if (status) {
    parsedUrl.searchParams.set("status", status);
  } else {
    parsedUrl.searchParams.delete("status");
  }

  if (merchantSearch) {
    parsedUrl.searchParams.set("search", merchantSearch);
  } else {
    parsedUrl.searchParams.delete("search"); 
  }

  return parsedUrl.toString();
}

// to call api
function loadTransactions(url) {
  const queryUrl = buildUrl();
  fetch(queryUrl)
    .then((response) => response.json())
    .then((data) => {
      displayTransactions(data);
      displayPagination(data);
    })
    .catch((error) => console.error("Error loading transactions:", error));
}


function getPageUrl(apiUrl) {
  if (!apiUrl) return baseUrl;
  const parsedApiUrl = new URL(apiUrl);
  const page = parsedApiUrl.searchParams.get("page");
  const newUrl = new URL(baseUrl);
  if (page) {
    newUrl.searchParams.set("page", page);
  }
  return newUrl.toString();
}


// Initial load
document.addEventListener("DOMContentLoaded", function () {
  loadTransactions(baseUrl);
});

document.querySelector("#status-filter").addEventListener("change", filterByStatus);

document.querySelector("#merchant-search").addEventListener("keyup", searchByMerchant);
