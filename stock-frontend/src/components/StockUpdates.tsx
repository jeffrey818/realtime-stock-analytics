import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface StockData {
    symbol: string;
    price: number;
    timestamp: string;
}

interface PredictionData {
    predicted_price: number;
    prediction_date: string;
}

const StockUpdates: React.FC<{ symbol: string }> = ({ symbol }) => {
    const [stockData, setStockData] = useState<StockData[]>([]);
    const [prediction, setPrediction] = useState<PredictionData | null>(null);

    useEffect(() => {
        // WebSocket connection for real-time updates
        const socket = new WebSocket(`ws://localhost:8001/ws/stocks/${symbol}/`);
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setStockData((prevData) => [...prevData, data]);
        };
        return () => {
            socket.close();
        };
    }, [symbol]);

    useEffect(() => {
        // Fetch prediction data from the backend
        axios.get(`http://localhost:8000/predict/${symbol}/`)
            .then((response) => {
                console.log(response);
                
                setPrediction(response.data)})
            .catch((error) => console.error("Error fetching prediction:", error));
    }, [symbol]);

    return (
        <div>
            <h2>Live Stock Updates for {symbol}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Price</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {stockData.map((data, index) => (
                        <tr key={index}>
                            <td>{data.symbol}</td>
                            <td>{data.price}</td>
                            <td>{data.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {prediction && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Predicted Price for {prediction.prediction_date}:</h3>
                    <p>${prediction.predicted_price}</p>
                </div>
            )}
        </div>
    );
};

export default StockUpdates;
