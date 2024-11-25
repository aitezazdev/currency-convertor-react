import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("PKR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(0);

  const API_URL = `https://open.er-api.com/v6/latest/${fromCurrency}`;

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setCurrencies(Object.keys(response.data.rates));
        convert();
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, [fromCurrency, toCurrency]);

  const convert = () => {
    axios.get(API_URL).then((response) => {
      const rate = response.data.rates[toCurrency];
      setResult((amount * rate).toFixed(2));
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Currency Converter
        </h1>
        <div className="flex flex-col gap-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount"
          />
          <div className="flex gap-4 items-center">
            {/* From */}
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
            {/* To */}
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
        <h2 className="text-xl font-semibold text-gray-700 text-center mt-6">
          {amount} {fromCurrency} = {result} {toCurrency}
        </h2>
      </div>
    </div>
  );
};

export default App;
