const crypto = require('crypto');
const superagent = require('superagent');

const ENDPOINT_BASE = 'https://stakecube.io/api/v2';

let API_KEY = '';
let SECRET  = '';

/* --- Backend calls --- */
function HMAC(input) {
    if (SECRET === '') throw "Please provide your HMAC SECRET";
    const hmac = crypto.createHmac('sha256', SECRET);
    hmac.write(input);
    return hmac.digest('hex');
}

function isLoggedIn() {
    return !((!API_KEY || API_KEY === '') || (!SECRET || SECRET === ''));
}

/* --- Local calls --- */
function login(key, secret) {
    API_KEY = key;
    SECRET  = secret;
    return true;
}

/* --- PUBLIC APIs --- */
async function getArbitrageInfo(ticker) {
    try {
        let res = await superagent
        .get(ENDPOINT_BASE + '/exchange/spot/arbitrageInfo?ticker=' + ticker)
        .set('User-Agent', 'StakeCube Node.js Library')
        .send();
        return res.body;
    } catch (e) {
        throw e;
    }
}

async function getMarkets(base, orderBy) {
    if (orderBy && orderBy.length > 0) {
        orderBy = orderBy.toLowerCase();
        if (orderBy !== "volume" && orderBy !== "change") {
            throw "orderBy '" + orderBy + "' is invalid, please use 'volume' or 'change'!";
        }
    }
    try {
        let res = await superagent
        .get(ENDPOINT_BASE + '/exchange/spot/markets?base=' + base + "&orderBy=" + orderBy)
        .set('User-Agent', 'StakeCube Node.js Library')
        .send();
        return res.body;
    } catch (e) {
        throw e;
    }
}

async function getOhlcData(market, interval) {
    if (!market || market.length === 0) throw "Please choose a market, e.g; 'SCC_BTC'";
    if (!interval || interval.length === 0) throw "Please select an interval, e.g; '1h'";
    interval = interval.toLowerCase();
    const _options = ["1m", "5m", "15m", "30m", "1h", "4h", "1d", "1w", "1mo"];
    if (!_options.includes(interval)) throw "interval '" + interval + "' is invalid, please review the documentation for the interval options!";
    try {
        let res = await superagent
        .get(ENDPOINT_BASE + '/exchange/spot/ohlcData?market=' + market + '&interval=' + interval)
        .set('User-Agent', 'StakeCube Node.js Library')
        .send();
        return res.body;
    } catch (e) {
        throw e;
    }
}

async function getRatelimits() {
    try {
        let res = await superagent
        .get(ENDPOINT_BASE + '/system/rateLimits')
        .set('User-Agent', 'StakeCube Node.js Library')
        .send();
        return res.body;
    } catch (e) {
        throw e;
    }
}

async function getTrades(market, limit = 100) {
    if (!market || market.length === 0) throw "Please choose a market, e.g; 'SCC_BTC'";
    if (typeof limit !== "number") throw "Please provide an integer for the 'limit'!";
    try {
        let res = await superagent
        .get(ENDPOINT_BASE + '/exchange/spot/trades?market=' + market + "&limit=" + limit)
        .set('User-Agent', 'StakeCube Node.js Library')
        .send();
        return res.body;
    } catch (e) {
        throw e;
    }
}

async function getOrderbook(market, side) {
    if (side && side.length > 0) {
        side = side.toUpperCase();
        if (side !== "BUY" && side !== "SELL") {
            throw "Side '" + side + "' is invalid, please use 'BUY' or 'SELL'!";
        }
    }
    try {
        let res = await superagent
        .get(ENDPOINT_BASE + '/exchange/spot/orderbook?market=' + market + '&side=' + side)
        .set('User-Agent', 'StakeCube Node.js Library')
        .send();
        return res.body;
    } catch (e) {
        throw e;
    }
}



async function getAccount() {
    if (!isLoggedIn()) throw "You must login to StakeCube with your API KEY and SECRET before sending private requests";
    try {
        // Format the input and craft a HMAC signature
        const input = "nonce=" + Date.now();
        const hmac = HMAC(input);

        // Send the request
        let res = await superagent
        .get(ENDPOINT_BASE + '/user/account?' + input + "&signature=" + hmac)
        .set('X-API-KEY', API_KEY)
        .set('User-Agent', 'StakeCube Node.js Library')
        .send();
        return res.body;
    } catch (e) {
        throw e;
    }
}

async function withdraw(ticker, address, amount) {
    if (!isLoggedIn()) throw "You must login to StakeCube with your API KEY and SECRET before sending private requests";
    try {
        // Format the input and craft a HMAC signature
        const input = "nonce=" + Date.now() + "&ticker=" + ticker + "&address=" + address + "&amount=" + amount;
        const hmac = HMAC(input);

        // Send the request
        let res = await superagent
        .post(ENDPOINT_BASE + '/user/withdraw')
        .set('X-API-KEY', API_KEY)
        .set('User-Agent', 'StakeCube Node.js Library')
        .send(input + "&signature=" + hmac);
        return res.body;
    } catch (e) {
        throw e;
    }
}

async function getOpenOrders() {
    if (!isLoggedIn()) throw "You must login to StakeCube with your API KEY and SECRET before sending private requests";
    try {
        // Format the input and craft a HMAC signature
        const input = "nonce=" + Date.now();
        const hmac = HMAC(input);
    
        // Send the request
        let res = await superagent
        .get(ENDPOINT_BASE + '/exchange/spot/myOpenOrder?' + input + "&signature=" + hmac)
        .set('X-API-KEY', API_KEY)
        .set('User-Agent', 'StakeCube Node.js Library')
        .send();
        return res.body;
    } catch (e) {
        throw e;
    }
}



async function getMyTrades(market, limit = 100) {
    if (!isLoggedIn()) throw "You must login to StakeCube with your API KEY and SECRET before sending private requests";
    try {
        // Format the input and craft a HMAC signature
        const input = "nonce=" + Date.now() + "&market=" + market + "&limit=" + limit;
        const hmac = HMAC(input);

        // Send the request
        let res = await superagent
        .get(ENDPOINT_BASE + '/exchange/spot/myTrades?' + input + "&signature=" + hmac)
        .set('X-API-KEY', API_KEY)
        .set('User-Agent', 'StakeCube Node.js Library')
        .send();
        return res.body;
    } catch (e) {
        throw e;
    }
}

async function getOrderHistory(market, limit = 100) {
    if (!isLoggedIn()) throw "You must login to StakeCube with your API KEY and SECRET before sending private requests";
    try {
        // Format the input and craft a HMAC signature
        const input = "nonce=" + Date.now() + "&market=" + market + "&limit=" + limit;
        const hmac = HMAC(input);

        // Send the request
        let res = await superagent
        .get(ENDPOINT_BASE + '/exchange/spot/myOrderHistory?' + input + "&signature=" + hmac)
        .set('X-API-KEY', API_KEY)
        .set('User-Agent', 'StakeCube Node.js Library')
        .send();
        return res.body;
    } catch (e) {
        throw e;
    }
}

async function postOrder(market, side, price, amount) {
    if (!isLoggedIn()) throw "You must login to StakeCube with your API KEY and SECRET before sending private requests";
    try {
        // Format the input and craft a HMAC signature
        const input = "nonce=" + Date.now() + "&market=" + market + "&side=" + side + "&price=" + price + "&amount=" + amount;
        const hmac = HMAC(input);

        // Send the request
        let res = await superagent
        .post(ENDPOINT_BASE + '/exchange/spot/order')
        .set('X-API-KEY', API_KEY)
        .set('User-Agent', 'StakeCube Node.js Library')
        .send(input + "&signature=" + hmac);
        return res.body;
    } catch (e) {
        throw e;
    }
}

async function cancel(orderID) {
    if (!isLoggedIn()) throw "You must login to StakeCube with your API KEY and SECRET before sending private requests";
    if (!orderID || orderID <= 1) throw "Please enter the order ID (integer)";
    try {
        // Format the input and craft a HMAC signature
        const input = "orderId=" + orderID + "&nonce=" + Date.now();
        const hmac = HMAC(input);

        // Send the request
        let res = await superagent
        .post(ENDPOINT_BASE + '/exchange/spot/cancel')
        .set('X-API-KEY', API_KEY)
        .set('User-Agent', 'StakeCube Node.js Library')
        .send(input + "&signature=" + hmac);
        return res.body;
    } catch (e) {
        throw e;
    }
}

async function cancelAll(market) {
    if (!isLoggedIn()) throw "You must login to StakeCube with your API KEY and SECRET before sending private requests";
    try {
        // Format the input and craft a HMAC signature
        const input = "nonce=" + Date.now() + "&market=" + market;
        const hmac = HMAC(input);

        // Send the request
        let res = await superagent
        .post(ENDPOINT_BASE + '/exchange/spot/cancelAll')
        .set('X-API-KEY', API_KEY)
        .set('User-Agent', 'StakeCube Node.js Library')
        .send(input + "&signature=" + hmac);
        return res.body;
    } catch (e) {
        throw e;
    }
}

module.exports = {
    // Built-in custom calls
    login,
    // Public API calls (no auth)
    getArbitrageInfo, getMarkets, getOhlcData, getRatelimits, getTrades, getOrderbook,
    // Private API calls (key + secret required via 'login' method)
    getAccount, withdraw, getOpenOrders, getMyTrades, getOrderHistory, postOrder, cancel, cancelAll
};