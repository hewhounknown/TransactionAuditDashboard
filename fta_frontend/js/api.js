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

    console.log(`built url ${parsedUrl}`)
    return parsedUrl.toString();
}

export function getPageUrl(apiUrl){
    if (!apiUrl) return baseURL;

    const parsedApiUrl = new URL(apiUrl);
    const page = parsedApiUrl.searchParams.get("page");

    const newUrl = new URL(currentPageURL);
    if (page) newUrl.searchParams.set("page", page);
    else newUrl.searchParams.delete("page");

    console.log(`page url: ${newUrl}`)
    return newUrl.toString();
}

async function getToken() {
    try {
        const response = await fetch('http://localhost:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: import.meta.env.SUPER_NAME,  // from .env SUPER_NAME
                password: import.meta.env.SUPER_PASSWORD    // from .env SUPER_PASSWORD
            })
        });

        if (!response.ok) {
            throw new Error('Failed to get token');
        }

        const data = await response.json();
        
        // Store tokens in localStorage
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        
        return data.access;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
}

// Helper function for authenticated requests
async function authenticatedFetch(url, options = {}) {
    let token = localStorage.getItem('access_token');
    if (!token) {
        await getToken();
        token = localStorage.getItem('access_token');
    }

    const defaultHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    return fetch(url, {
        ...options,
        headers: defaultHeaders
    });
}

export async function fetchTransactions(url) {
    try {
        const response = await authenticatedFetch(buildUrl(url));
        return await response.json();
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return { results: [] };   
    }
}

export async function approveTransaction(code) {
    try {
        const response = await authenticatedFetch(`${baseURL}${code}/approve/`, {
            method: 'PUT'
        });
        await response.json();
        console.log(`${code} is approve`);
        return true;
    } catch (error) {
        console.error("Error approving transaction:", error);
        return false;
    }
}

export async function flagTransaction(code) {
    try {
        const response = await authenticatedFetch(`${baseURL}${code}/flag/`, {
            method: 'PUT'
        });
        await response.json();
        console.log(`${code} changed flag`);
        return true;
    } catch (error) {
        console.error("Error flagging transaction:", error);
        return false;
    }
}

export async function fetchSummaryBy(val) {
    try {
        const response = await authenticatedFetch(`${baseURL}${val}/`);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(`Error fetching total amount per ${val}: `, error);
        return { results: [] };   
    }
}