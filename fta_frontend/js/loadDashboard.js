import { fetchSummaryBy } from "./api.js";

async function loadStatsCards(){
    let totalAmountsPerStatus = await fetchSummaryBy('summary-per-status')

    if (Array.isArray(totalAmountsPerStatus)) {
        
        let completed = totalAmountsPerStatus.find(item => item.status === "completed") || { total_amount: 0, transaction_count: 0 };
        let pending = totalAmountsPerStatus.find(item => item.status === "pending") || { total_amount: 0, transaction_count: 0 };
        let failed = totalAmountsPerStatus.find(item => item.status === "failed") || { total_amount: 0, transaction_count: 0 };

        document.getElementById('completed-amounts').innerText = `$${completed.total_amount}`;
        document.getElementById('completed-count').innerText = `Total: ${completed.transaction_count}`;

        document.getElementById('pending-amounts').innerText = `$${pending.total_amount}`;
        document.getElementById('pending-count').innerText = `Total: ${pending.transaction_count}`;

        document.getElementById('failed-amounts').innerText = `$${failed.total_amount}`;
        document.getElementById('failed-count').innerText = `Total: ${failed.transaction_count}`;
    } else {
        console.error("Invalid response format:", totalAmountsPerStatus);
    }
}

document.addEventListener("DOMContentLoaded", () => loadStatsCards());