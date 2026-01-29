import { useState } from 'react'
import Header from './components/Header'
import Menu from './components/Menu/Menu'
import Cart from './components/Cart/Cart'
import Checkout from './components/Checkout/Checkout'

type PageView = 'menu' | 'cart' | 'checkout';

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('menu');

  const renderPage = () => {
    switch (currentPage) {
      case 'menu':
        return <Menu onGoToCart={() => setCurrentPage('cart')} />;
      case 'cart':
        return (
          <Cart 
            onGoBack={() => setCurrentPage('menu')}
            onCheckout={() => setCurrentPage('checkout')}
          />
        );
      case 'checkout':
        return (
          <Checkout 
            onGoBack={() => setCurrentPage('cart')}
            onOrderComplete={() => {
              setCurrentPage('menu');
              alert('訂單已送出！商家將盡快為您準備餐點。');
            }}
          />
        );
      default:
        return <Menu onGoToCart={() => setCurrentPage('cart')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
