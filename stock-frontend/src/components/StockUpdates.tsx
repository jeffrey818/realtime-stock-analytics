// src/components/StockUpdates.tsx
import React, { useEffect, useState } from 'react';

interface StockData {
    symbol: string;
    price: number;
    timestamp: string;
}

const StockUpdates: React.FC<{ symbol: string }> = ({ symbol }) => {
    const [stockData, setStockData] = useState<StockData[]>([]);

    useEffect(() => {
        // Define the WebSocket URL (adjust the host/port if necessary)
        const socket = new WebSocket(`ws://localhost:8001/ws/stocks/${symbol}/`);

        // Handle incoming messages
        socket.onmessage = (event) => {
            console.log('Message from server:', event.data);
            const data = JSON.parse(event.data);
            console.log(data);
            
            setStockData((prevData) => [...prevData, data]);
        };

        socket.onopen = () => {
            console.log('WebSocket connection opened');
          };

        // Close the socket when the component is unmounted
        return () => {
            socket.close();
        };
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
        </div>
    );
};

export default StockUpdates;
