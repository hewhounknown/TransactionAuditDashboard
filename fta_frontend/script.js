let currentPageUrl = "http://localhost:8000/api/transactions/";

function loadTransactions(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let rows = data.results.map(tx => `
                <tr>
                    <td>${tx.merchant}</td>
                    <td>${tx.amount}</td>
                    <td>${tx.status}</td>
                    <td>${tx.is_flagged ? "Yes" : "No"}</td>
                    <td>${tx.approved_by ?? "-"}</td>
                </tr>`
            ).join("");
            document.querySelector("#transaction-table").innerHTML = rows;
            
            document.querySelector("#prev-page").disabled = !data.previous;
            document.querySelector("#next-page").disabled = !data.next;
            
            if (data.previous) {
                document.querySelector("#prev-page").onclick = function() {
                    loadTransactions(data.previous);
                };
            }
            
            if (data.next) {
                document.querySelector("#next-page").onclick = function() {
                    loadTransactions(data.next);
                };
            }
        });
}

document.addEventListener("DOMContentLoaded", function() {
    loadTransactions(currentPageUrl);
});