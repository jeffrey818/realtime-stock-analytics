import React, { useRef } from 'react';
import { Layout, Menu } from 'antd';
import StockUpdates from './components/StockUpdates';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const menuRef = useRef(null);

  return (
    <div className="App">
            <h1>Stock Analytics Platform</h1>
            <StockUpdates symbol="AAPL" />
        </div>
    // <Layout>
    //   <Header>
    //     <div className="logo" />
    //     <Menu ref={menuRef} theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
    //       <Menu.Item key="1">Home</Menu.Item>
    //       <Menu.Item key="2">Dashboard</Menu.Item>
    //       <Menu.Item key="3">Watchlist</Menu.Item>
    //     </Menu>
    //   </Header>
    //   <Content style={{ padding: '0 50px' }}>
    //     <div className="site-layout-content" style={{ marginTop: '20px' }}>
    //       <h1>Welcome to Stock Analytics Platform</h1>
    //     </div>

        
    //     {/* <div className="App">
    //         <h1>Stock Chart</h1>
    //         <StockChart symbol="AAPL" />
    //     </div> */}
    //   </Content>
    //   <Footer style={{ textAlign: 'center' }}>
    //     Stock Analytics ©2024 Created by You
    //   </Footer>
    // </Layout>
  );
};

export default App;
