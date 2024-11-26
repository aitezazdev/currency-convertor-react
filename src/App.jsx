import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("PKR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const API_URL = `https://open.er-api.com/v6/latest/${fromCurrency}`;

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setCurrencies(Object.keys(response.data.rates));
      })
      .catch(() => {
        setError("Failed to load currency data. Try again later.");
      });
  }, [fromCurrency]);

  const handleAmountChange = (e) => {
    const value = Number(e.target.value);
    setAmount(value);
    if (value > 0) setError("");
  };

  const convert = () => {
    if (amount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    setError("");
    axios
      .get(API_URL)
      .then((response) => {
        const rate = response.data.rates[toCurrency];
        if (!rate) {
          setError("Conversion rate not available for the selected currencies.");
          setResult(null);
        } else {
          setResult((amount * rate).toFixed(2));
        }
      })
      .catch(() => {
        setError("Error fetching conversion rate. Please try again.");
        setResult(null);
      });
  };

  return (
    <div className="min-h-screen bg-zinc-500 flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-4">
          Currency Converter
        </h1>
        <div className="flex flex-col gap-4">
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount"
          />
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex gap-4 items-center">
            {/* From Currency Selector */}
            <div className="flex flex-col w-1/2">
              <label className="font-medium text-gray-600 mb-1">From:</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
            </div>
            {/* To Currency Selector */}
            <div className="flex flex-col w-1/2">
              <label className="font-medium text-gray-600 mb-1">To:</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={convert}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Convert
          </button>
        </div>
        <h2 className="text-xl font-semibold text-white text-center mt-6">
          {amount > 0 && result !== null
            ? `${amount} ${fromCurrency} = ${result} ${toCurrency}`
            : "Enter a valid amount to see the result."}
        </h2>
      </div>
    </div>
  );
};

export default App;
