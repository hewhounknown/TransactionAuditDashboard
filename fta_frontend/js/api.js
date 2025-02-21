const baseURL = "http://localhost:8000/api/transactions/";

let currentPageURL = baseURL

console.log("this is from apijs")

function buildUrl(url){
    const status = document.querySelector("#status-filter").value.toLowerCase();
    const search = document.querySelector("#merchant-search").value.trim();
    const parsedUrl = new URL(url);

    if (status) parsedUrl.searchParams.set("status", status);
    else parsedUrl.searchParams.delete("status");

    if (search) parsedUrl.searchParams.set("search", search);
    else parsedUrl.searchParams.delete("search");

    return parsedUrl.toString();
}

export function getPageUrl(apiUrl){
    if (!apiUrl) return baseURL;

    const parsedApiUrl = new URL(apiUrl);
    const page = parsedApiUrl.searchParams.get("page");

    const newUrl = new URL(currentPageURL);
    if (page) newUrl.searchParams.set("page", page);
    else newUrl.searchParams.delete("page");

    return newUrl.toString();
}

export async function fetchTransactions(url){
    try {
        const response = await fetch(buildUrl(url));
        return await response.json();
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return { results: [] };   
    }
}

export async function approveTransaction(code){
    let url = `${baseURL}${code}/approve/`;

    try {
        await fetch(url, { method: 'PUT'}).then(
            (response) => response.json()
        );
        console.log(`${code} is approve`)
        return await true;
    } catch (error) {
        console.error("Error approving transaction:", error);
        return false;
    }
}

export async function flagTransaction(code){
    let url = `${baseURL}${code}/flag/`;

    try {
        await fetch(url, { method: 'PUT'}).then(
            (response) => response.json()
        );
        console.log(`${code} changed flag`)
        return await true;
    } catch (error) {
        console.error("Error flagging transaction:", error);
        return false;
    }
}

export async function  fetchSummaryBy(val) {
    let url = `${baseURL}${val}/`;

    try {
        const response = await fetch(url);
        let data = await response.json()
        console.log(data)
        return data;
    } catch (error) {
        console.error(`Error fetching total amount per ${val}: `, error);
        return { results: [] };   
    }
}