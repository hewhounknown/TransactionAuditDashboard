const baseUrl = "http://localhost:8000/api/transactions/";
let currentPageUrl = baseUrl;

// Build URL with filtering by status or merchant search
function buildUrl(url) {
  const status = document.querySelector("#status-filter").value.toLowerCase();
  const search = document.querySelector("#merchant-search").value.trim();
  const parsedUrl = new URL(url);

  if (status) {
    parsedUrl.searchParams.set("status", status);
  } else {
    parsedUrl.searchParams.delete("status");
  }

  if (search) {
    parsedUrl.searchParams.set("search", search);
  } else {
    parsedUrl.searchParams.delete("search");
  }

  return parsedUrl.toString();
}

// Extract page parameter from API URLs and preserve existing filters
function getPageUrl(apiUrl) {
  if (!apiUrl) return baseUrl;
  const parsedApiUrl = new URL(apiUrl);
  const page = parsedApiUrl.searchParams.get("page");

  const newUrl = new URL(currentPageUrl); 

  if (page) {
    newUrl.searchParams.set("page", page);
  } else {
    newUrl.searchParams.delete("page");
  }

  return newUrl.toString();
}

// call api and update the table
function loadTransactions(url) {
  currentPageUrl = buildUrl(url);
  fetch(currentPageUrl)
    .then((response) => response.json())
    .then((data) => {
      let rows = data.results
        .map(
          (tx) => `
          <tr>
            <td>${tx.merchant}</td>
            <td>${tx.amount}</td>
            <td><span class="badge ${getStatusBadgeClass(tx.status)}">${tx.status}</span></td>
            <td><span class="badge ${tx.is_flagged ? "bg-danger" : "bg-secondary"}">${tx.is_flagged ? "Flagged" : "No"}</span></td>
            <td>${tx.approved_by ?? "-"}</td>
          </tr>`
        )
        .join("");

      document.querySelector("#transaction-table").innerHTML = rows || `<tr><td colspan="5" class="text-center text-muted">No transactions found.</td></tr>`;

      updatePaginationButtons(data.previous, data.next);
    })
    .catch((error) => console.error("Error loading transactions:", error));
}

// Update pagination button state
function updatePaginationButtons(previous, next) {
  const prevBtn = document.querySelector("#prev-page");
  const nextBtn = document.querySelector("#next-page");

  prevBtn.disabled = !previous;
  nextBtn.disabled = !next;

  prevBtn.onclick = previous ? () => loadTransactions(getPageUrl(previous)) : null;
  nextBtn.onclick = next ? () => loadTransactions(getPageUrl(next)) : null;
}

// Get Bootstrap badge class based on status
function getStatusBadgeClass(status) {
  switch (status) {
    case "pending":
      return "bg-warning text-dark";
    case "completed":
      return "bg-success";
    case "failed":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => loadTransactions(baseUrl));
document.querySelector("#status-filter").addEventListener("change", () => loadTransactions(baseUrl));
document.querySelector("#merchant-search").addEventListener("input", () => loadTransactions(baseUrl));
