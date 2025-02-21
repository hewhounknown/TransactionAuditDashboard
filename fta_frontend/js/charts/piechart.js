import { fetchSummaryBy } from "../api.js";

async function generatePieChart(){
    let summaryPerStatus = await fetchSummaryBy('summary-per-status');
    let status = summaryPerStatus.map(s => s.status);
    let totalAmounts = summaryPerStatus.map(s => s.total_amount);

    const data = {
        labels: status,
        datasets: [
            {
                label: 'Total Amount ($)',
                data: totalAmounts,
                backgroundColor: ["#fc0539", "#25b6ff", "#e9fa2f"],
            }
        ]
    };

    const ctx = document.getElementById("statusPieChart").getContext("2d");
    
    new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                position: 'top',
                },
                title: {
                display: true,
                text: 'Transaction Amounts by Status'
                }
            }
        },
    });
}

document.addEventListener("DOMContentLoaded", () => generatePieChart());
