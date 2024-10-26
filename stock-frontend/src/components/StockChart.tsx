import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

interface StockData {
    symbol: string;
    price: number;
    timestamp: string;
}

const StockChart: React.FC<{ symbol: string }> = ({ symbol }) => {
    const [data, setData] = useState<StockData[]>([]);

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8001/ws/stocks/${symbol}/`);

        socket.onmessage = (event) => {
            const stockData = JSON.parse(event.data);
            setData((prevData) => [...prevData, stockData]);
        };

        return () => {
            socket.close();
        };
    }, [symbol]);

    return (
        <Table
            dataSource={data}
            columns={[
                { title: 'Price', dataIndex: 'price', key: 'price' },
                { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
            ]}
            rowKey="timestamp"
        />
    );
};

export default StockChart;
