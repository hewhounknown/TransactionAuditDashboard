import { fetchSummaryBy } from "../api.js";

async function generateColumnChart(params) {

    const summaryPerMerchant = await fetchSummaryBy('summary-per-merchant');
    const merchants = summaryPerMerchant.map(m => m.merchant);
    const totalAmounts = summaryPerMerchant.map(m => m.total_amount);
    const transactionCounts = summaryPerMerchant.map(m => m.transaction_count);
    

    var options = {
        series: [
            {
                name: "Total Amount ($)",
                data: totalAmounts
            },
            {
                name: "Transaction Count",
                data: transactionCounts
            }
        ],
        chart: {
            type: "bar",
            height: 500,
            stacked: false
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "50%"
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: merchants,
            labels: {
                rotate: -45
            }
        },
        yaxis: [
            {
                title: {
                    text: "Total Amount ($)"
                }
            },
            {
                opposite: true,
                title: {
                    text: "Transaction Count"
                }
            }
        ],
        legend: {
            position: "top"
        },
        colors: ["#008FFB", "#FF4560"]
    };

    const chart = new ApexCharts(document.querySelector("#merchantChart"), options);
    chart.render();
}

document.addEventListener("DOMContentLoaded", () => generateColumnChart());