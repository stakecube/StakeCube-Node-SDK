# StakeCube-Node-SDK
The official StakeCube API SDK for Node.js - Available on NPM!

## Install
NPM: `npm i stakecube-node-sdk`

...or clone via git and import the module yourself!

## Setup
To start using the StakeCube SDK, import the module in the format you prefer below:

```js
let SC = require('stakecube-node-sdk');
```
or...
```js
import { login, getAccount, ... } from 'stakecube-node-sdk';
```

After installing the module, grab your **API Key** and **Secret** from your [StakeCube API](https://stakecube.net/app/profile/api-keys) interface, to use private APIs with this package, you'll have to call the below method:
```js
// Example code
let SC = require('stakecube-node-sdk');
SC.login("your_api_key", "your_secret");
```
Then you're ready to roll!

---

## Usage

### Note: If you're looking for Advanced REST API documentation, please use [this document](https://github.com/stakecube/DevCube/tree/master/rest-api) from DevCube!

### Login
> Authenticates with your StakeCube account via API Key + Secret, this will allow you to use Private APIs.
- Method: `login(key, secret);`

Parameter | Description | Example
------------ | ------------- | -------------
(required) key | the SC account's API key | N/A
(required) secret | the SC account's Secret | N/A

Example:
```js
SC.login("api_key", "secret"); // result: 'true'
```

---

### Get Arbitrage Info
> Gets arbitrage information for a chosen coin ticker.
- Method: `getArbitrageInfo(ticker);`

Parameter | Description | Example
------------ | ------------- | -------------
(required) ticker | the ticker of a coin | SCC

Example:
```js
SC.getArbitrageInfo("SCC").then(res => { console.log(res) }); // result: { 'coingecko-provided market info object' }
```

---

### Get Markets
> Gets a list of all StakeCube markets under the chosen base market, optionally sorted by `volume` or `change`, but by default sorted alphabetically.
- Method: `getMarkets(base, orderBy);`

Parameter | Description | Example
------------ | ------------- | -------------
(required) base | the chosen base coin | BTC
(optional) orderBy | the ordering of the list | `volume` or `change`

Example:
```js
SC.getMarkets("SCC", "volume").then(res => { console.log(res) }); // result: { SCC_BTC: {}, DASH_BTC: {} ... }
```

---

### Get OHLC Data
> Gets an array of the last 500 candles for the chosen market pair and interval.
- Method: `getOhlcData(market, interval);`

Parameter | Description | Example
------------ | ------------- | -------------
(required) market | the chosen market pair | SCC_BTC
(required) interval | the per-candle timeframe / period | `1m`, `5m`, `15m`, `30m`, `1h`, `4h`, `1d`, `1w`, `1mo`

Example:
```js
SC.getOhlcData("SCC_BTC", "1d").then(res => { console.log(res) }); // result: { depth: { asks: [], bids: []}, lines: [], trades: [] }
```

---

### Get MineCube Info
> Gets the current real-time info for MineCube, such as total and available workers, the price of workers, and the payouts-in-progress status.
- Method: `getMineCubeInfo();`

Example:
```js
SC.getMineCubeInfo().then(res => { console.log(res) }); // result: { totalWorker: 123, workerAvailable: 100, ... }
```

---

### Get MineCube Miners
> Gets a list of all Miners belonging to MineCube, you may optionally specify a coin to see miners for only that coin, such as 'ETH' which uses AMD GPUs, or 'DASH' which uses StrongU ASICs.
- Method: `getMineCubeMiners(coin);`

Example:
```js
SC.getMineCubeMiners().then(res => { console.log(res) }); // result: { BTC: { minerCount: 200, miner: [ ... ], ... }, DASH: ...  }
```

---

### Get Rate Limits
> Gets the current global StakeCube rate-limits for APIs.
- Method: `getRatelimits();`

Example:
```js
SC.getRatelimits().then(res => { console.log(res) }); // result: [ { rate_limit_type: "REQUEST_WEIGHT", interval: "DAY" ... } ... ]
```

---

### Get Trades
> Returns the last trades of a specified market pair, optionally with a custom results limit.

- Method: `getTrades(market);`

Parameter | Description | Example
------------ | ------------- | -------------
(required) market | the chosen market pair | SCC_BTC
(optional) limit | the maximum returned trades | 100

Example:
```js
SC.getTrades("SCC_BTC").then(res => { console.log(res) }); // result: [ { direction: "BUY", amount: "1.23", price: ... } ... ]
```

---

### Get Orderbook
> Gets the orderbook of a chosen market, optionally a specified side, but by default will load both orderbook sides.
- Method: `getOrderbook(market);`

Parameter | Description | Example
------------ | ------------- | -------------
(required) market | the chosen market pair | SCC_BTC
(optional) side | the orderbook side | `buy` or `sell`

Example:
```js
SC.getOrderbook("SCC_BTC").then(res => { console.log(res) }); // result: { asks: [], bids: [] }
```

---

## Private APIs

These APIs require you to be logged-in with an API key of sufficient permissions to perform the private action, for example, withdrawals will work on any key with the Withdrawals Permission enabled, order placing/cancelling will work on a key with "Full Permissions", but will not work on a "Read only" key, be aware of this and customize your keys accordingly for security!

To login, please use the `login(key, secret);` method provided by the SDK, and key/secret provided by the StakeCube v3 [API Dashboard](https://stakecube.net/app/profile/api-keys).

---

### Get Account (Auth Required)
> Returns general information about your StakeCube account, including wallets, balances, fee-rate in percentage and your account username.
- Method: `getAccount();`


Example:
```js
SC.login("your_key", "your_secret"); // result: true
SC.getAccount().then(res => { console.log(res) }); // result: { user: "JSKitty", exchangeFee: 0.05, wallets: [ ... ], ... }
```

---

### Withdraw (Auth Required)
> Creates a withdrawal request with a specified coin, address and amount.
- Method: `withdraw(ticker, address, amount);`

Parameter | Description | Example
------------ | ------------- | -------------
(required) ticker | the withdrawal coin | SCC
(required) address | the withdrawal address | sWdSgX...
(required) amount | the withdrawal amount | 1.23

Example:
```js
SC.login("your_key", "your_secret"); // result: true
SC.withdraw("SCC", "sWdSgX...", 1.23).then(res => { console.log(res) }); // result: { success: true }
```

---

### Get Open Orders (Auth Required)
> Returns a list of all open orders for all StakeCube Exchange markets.
- Method: `getOpenOrders();`


Example:
```js
SC.login("your_key", "your_secret"); // result: true
SC.getOpenOrders().then(res => { console.log(res) }); // result: [ { market: "SCC_BTC", id: 123, side: "BUY", ... }, ... ]
```

---

### Get My Trades (Auth Required)
> Returns a list of all trades, you can leave the market empty ("") to return all trades, or specify a market such as "SCC_BTC" to return those market orders, you may also specify a limit of the amount of returned trades, of which the default is 100 trades.
- Method: `getMyTrades(market, limit);`

Parameter | Description | Example
------------ | ------------- | -------------
(optional) market | the market pair | SCC_BTC
(optional) limit | the maximum returned trades | 100

Example:
```js
SC.login("your_key", "your_secret"); // result: true
SC.getMyTrades().then(res => { console.log(res) }); // result: [ { market: "SCC_BTC", id: 123, direction: "BUY", ... }, ... ]
```

---

### Get Order History (Auth Required)
> Returns a list of all orders from a specified market such as "SCC_BTC", you may also specify a limit of the amount of returned orders, of which the default is 100 orders.
- Method: `getOrderHistory(market, limit);`

Parameter | Description | Example
------------ | ------------- | -------------
(required) market | the market pair | SCC_BTC
(optional) limit | the maximum returned trades | 100

Example:
```js
SC.login("your_key", "your_secret"); // result: true
SC.getOrderHistory("SCC_BTC").then(res => { console.log(res) }); // result: [ { market: "SCC_BTC", type: "MARKET", side: "BUY", ... }, ... ]
```

---

### Post Order (Auth Required)
> Creates an exchange order for the specified market pair, orderbook side, price and amount.
- Method: `postOrder(market, side, price, amount);`

Parameter | Description | Example
------------ | ------------- | -------------
(required) market | the market pair | SCC_BTC
(required) side | the trade side | BUY
(required) price | the price in the base coin | 0.00002000 (BTC)
(required) amount | the amount of the trade coin | 1000 (SCC)

Example:
```js
SC.login("your_key", "your_secret"); // result: true
SC.postOrder("SCC_BTC", "BUY", 0.00002000, 1000).then(res => { console.log(res) }); // result: { orderId: 123, executedAmount: 0, fills: [], ... }
```

---

### Cancel Order (Auth Required)
> Cancels an open order by it's orderId
- Method: `cancel(orderId);`

Parameter | Description | Example
------------ | ------------- | -------------
(required) orderId | the ID of your order | 123

Example:
```js
SC.login("your_key", "your_secret"); // result: true
SC.cancel(123).then(res => { console.log(res) }); // result: { originalAmount: 1000, executedAmount: 0, canceledAmount: 0.02, ... }
```

---

### Cancel All (Auth Required)
> Cancels all orders in a specified market pair.
- Method: `cancelAll(market);`

Parameter | Description | Example
------------ | ------------- | -------------
(required) market | the market pair | SCC_BTC

Example:
```js
SC.login("your_key", "your_secret"); // result: true
SC.cancelAll("SCC_BTC").then(res => { console.log(res) }); // result: [ { originalAmount: 1000, executedAmount: 0, canceledAmount: 0.02, ... }, ... ]
```

---

### Set MineCube Payout Coin (Auth Required)
> Sets a coin as the preferred payout coin to receive upon future MineCube payouts.
- Method: `setMineCubePayoutCoin(coin);`

Parameter | Description | Example
------------ | ------------- | -------------
(required) coin | the MineCube payout coin | SCC

Example:
```js
SC.login("your_key", "your_secret"); // result: true
SC.setMineCubePayoutCoin("SCC").then(res => { console.log(res) }); // result: { success: true, ... }
```

---

### Buy MineCube Workers (Auth Required)
> Buys a specified amount of MineCube workers using the chosen payment method.
- Method: `buyMineCubeWorkers(method, workers);`

Parameter | Description | Example
------------ | ------------- | -------------
(required) method | the payment method | `SCC` or `CREDITS`
(required) workers | the worker quantity | 10

Example:
```js
SC.login("your_key", "your_secret"); // result: true
SC.buyMineCubeWorkers("SCC", 10).then(res => { console.log(res) }); // result: { success: true, ... }
```