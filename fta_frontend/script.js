const baseUrl = "http://localhost:8000/api/transactions/";
let currentPageUrl = baseUrl;

// Build URL by adding/updating the status parameter (converted to lowercase)
function buildUrl(url) {
  const status = document.querySelector("#status-filter").value.toLowerCase();
  const parsedUrl = new URL(url);
  if (status) {
    parsedUrl.searchParams.set("status", status);
  } else {
    parsedUrl.searchParams.delete("status");
  }
  return parsedUrl.toString();
}

// Extract the page parameter from API-provided URLs and build a new URL from baseUrl using the URL API
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

function loadTransactions(url) {
  const queryUrl = buildUrl(url);
  fetch(queryUrl)
    .then((response) => response.json())
    .then((data) => {
      let rows = data.results
        .map(
          (tx) => `
          <tr>
            <td>${tx.merchant}</td>
            <td>${tx.amount}</td>
            <td>${tx.status}</td>
            <td>${tx.is_flagged ? "Yes" : "No"}</td>
            <td>${tx.approved_by ?? "-"}</td>
          </tr>`
        )
        .join("");
      document.querySelector("#transaction-table").innerHTML = rows;

      // Update pagination button state
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
    })
    .catch((error) => console.error("Error loading transactions:", error));
}

// Initial load
document.addEventListener("DOMContentLoaded", function () {
  loadTransactions(baseUrl);
});

// When filter changes, reset to the base URL and reload transactions
document.querySelector("#status-filter").addEventListener("change", function () {
  currentPageUrl = baseUrl;
  loadTransactions(baseUrl);
});