// src/App.tsx
import React from 'react';
import { Layout, Menu } from 'antd';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  return (
    <Layout>
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Home</Menu.Item>
          <Menu.Item key="2">Dashboard</Menu.Item>
          <Menu.Item key="3">Watchlist</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content" style={{ marginTop: '20px' }}>
          <h1>Welcome to Stock Analytics Platform</h1>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Stock Analytics ©2024 Created by You
      </Footer>
    </Layout>
  );
};

export default App;
