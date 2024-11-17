import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Card, Layout, Spin } from 'antd';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const { Header, Content, Footer } = Layout;

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8001/ws/stocks/${symbol}/`);

        // Handle WebSocket messages
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Message from server:', data);

            setStockData((prevData) => [...prevData, data]);
            setLoading(false); // Stop loading once the first message is received
        };

        socket.onopen = () => {
            console.log('WebSocket connection opened');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setLoading(false);
        };

        // Cleanup WebSocket on unmount
        return () => {
            socket.close();
        };
    }, [symbol]);

    useEffect(() => {
        axios
            .get(`http://localhost:8000/predict/${symbol}/`)
            .then((response) => {
                setPrediction(response.data);
            })
            .catch((error) => console.error('Error fetching prediction:', error));
    }, [symbol]);

    // Prepare Chart.js data
    const chartData = {
        labels: stockData.map((data) => new Date(data.timestamp).toLocaleTimeString()),
        datasets: [
            {
                label: `${symbol} Price`,
                data: stockData.map((data) => data.price),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    return (
        <Layout>
            <Header style={{ color: 'white', textAlign: 'center' }}>
                <h1>Stock Analytics Dashboard</h1>
            </Header>
            <Content style={{ padding: '20px' }}>
                {loading && <Spin size="large" tip="Loading WebSocket data..." />}
                {!loading && (
                    <>
                        <Card title={`Live Updates for ${symbol}`} style={{ marginBottom: '20px' }}>
                            <Line data={chartData} />
                        </Card>
                        <Table
                            dataSource={stockData}
                            columns={[
                                { title: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
                                { title: 'Price', dataIndex: 'price', key: 'price' },
                                { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
                            ]}
                            rowKey="timestamp"
                            pagination={{ pageSize: 5 }}
                            style={{ marginBottom: '20px' }}
                        />
                        {prediction && (
                            <Card title="Predicted Price">
                                <p>
                                    <strong>Prediction Date:</strong> {prediction.prediction_date}
                                </p>
                                <p>
                                    <strong>Predicted Price:</strong> ${prediction.predicted_price}
                                </p>
                            </Card>
                        )}
                    </>
                )}
            </Content>
            <Footer style={{ textAlign: 'center' }}>Stock Analytics Platform ©2024 Created by You</Footer>
        </Layout>
    );
};

export default StockUpdates;
