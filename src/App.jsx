import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Search,
  ShoppingCart,
  User,
  Menu as MenuIcon,
  X,
  Plus,
  Minus,
  Star,
  Clock,
  MapPin,
  Phone,
  CreditCard,
  Check
} from 'lucide-react';
import './index.css';

/* --------------------------
   Sample data (from user)
   -------------------------- */
const categories = [
  { id: 1, name: 'Pizza', icon: '🍕' },
  { id: 2, name: 'Burgers', icon: '🍔' },
  { id: 3, name: 'Drinks', icon: '🥤' },
  { id: 4, name: 'Desserts', icon: '🍰' },
  { id: 5, name: 'Asian', icon: '🍜' },
  { id: 6, name: 'Healthy', icon: '🥗' }
];

const menuItems = [
  { id: 1, name: 'Margherita Pizza', category: 'Pizza', price: 12.99, rating: 4.5, image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=300&h=200&fit=crop', description: 'Fresh mozzarella, tomato sauce, basil' },
  { id: 2, name: 'Pepperoni Pizza', category: 'Pizza', price: 15.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop', description: 'Pepperoni, mozzarella, tomato sauce' },
  { id: 3, name: 'Classic Burger', category: 'Burgers', price: 9.99, rating: 4.3, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop', description: 'Beef patty, lettuce, tomato, onion' },
  { id: 4, name: 'Cheese Burger', category: 'Burgers', price: 11.99, rating: 4.6, image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300&h=200&fit=crop', description: 'Beef patty, cheese, lettuce, tomato' },
  { id: 5, name: 'Coca Cola', category: 'Drinks', price: 2.99, rating: 4.2, image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300&h=200&fit=crop', description: 'Classic refreshing cola' },
  { id: 6, name: 'Fresh Juice', category: 'Drinks', price: 4.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=300&h=200&fit=crop', description: 'Freshly squeezed orange juice' },
  { id: 7, name: 'Chocolate Cake', category: 'Desserts', price: 6.99, rating: 4.9, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop', description: 'Rich chocolate cake with frosting' },
  { id: 8, name: 'Ice Cream', category: 'Desserts', price: 4.99, rating: 4.4, image: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=300&h=200&fit=crop', description: 'Vanilla ice cream with toppings' },
  { id: 9, name: 'Ramen Bowl', category: 'Asian', price: 13.99, rating: 4.6, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop', description: 'Traditional Japanese ramen' },
  { id: 10, name: 'Caesar Salad', category: 'Healthy', price: 8.99, rating: 4.3, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop', description: 'Fresh lettuce, croutons, parmesan' }
];

const popularItems = menuItems.filter(item => item.rating >= 4.5);

/* --------------------------
   Helper utilities
   -------------------------- */
const currency = (n) => `$${n.toFixed(2)}`;
const generateOrderId = () => `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

/* --------------------------
   Main App Component
   -------------------------- */
function App() {
  const [currentPage, setCurrentPage] = useState('home'); // home, menu, cart, checkout, orders
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
        { name: 'Coca Cola', quantity: 2, price: 2.99 }
      ],
      total: 18.97,
      status: 'delivered',
      date: '2025-01-15'
    },
    {
      id: 'ORD-002',
      items: [
        { name: 'Classic Burger', quantity: 2, price: 9.99 },
        { name: 'Fresh Juice', quantity: 1, price: 4.99 }
      ],
      total: 24.97,
      status: 'preparing',
      date: '2025-01-16'
    }
  ]);
  const [orderForm, setOrderForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    paymentMethod: 'card'
  });

  /* Filtering & Sorting */
  const filteredItems = menuItems.filter(item => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = !q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesPriceRange = priceRange === 'all' ||
      (priceRange === 'low' && item.price <= 10) ||
      (priceRange === 'medium' && item.price > 10 && item.price <= 15) ||
      (priceRange === 'high' && item.price > 15);
    return matchesSearch && matchesCategory && matchesPriceRange;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      default: return a.name.localeCompare(b.name);
    }
  });

  /* Cart operations */
  const addToCart = (item) => {
    setCart(prev => {
      const found = prev.find(i => i.id === item.id);
      if (found) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const increaseQty = (id) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  };

  const decreaseQty = (id) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.quantity * i.price, 0);

  /* Checkout / Orders */
  const handlePlaceOrder = async (e) => {
    e?.preventDefault();
    if (cart.length === 0) return alert('Your cart is empty.');
    if (!orderForm.name || !orderForm.address || !orderForm.phone) return alert('Please fill delivery details.');

    setIsLoading(true);
    // simulate API / processing
    setTimeout(() => {
      const newOrder = {
        id: generateOrderId(),
        items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
        total: parseFloat(cartTotal.toFixed(2)),
        status: 'pending',
        date: new Date().toISOString().slice(0, 10)
      };
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      setIsLoading(false);
      setOrderPlaced(true);
      setCurrentPage('orders');
      // reset form
      setOrderForm({ name: '', address: '', phone: '', email: '', paymentMethod: 'card' });
      setTimeout(() => setOrderPlaced(false), 3000);
    }, 1200);
  };

  /* Simple UI helpers */
  useEffect(() => {
    if (!mobileMenuOpen) document.body.style.overflow = '';
    else document.body.style.overflow = 'hidden';
  }, [mobileMenuOpen]);

  /* JSX Pages */
  const Header = () => (
    <header className="header">
      <nav className="nav">
        <a href="#root" className="logo" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Foodify</a>

        <ul className="nav-links" aria-hidden={mobileMenuOpen}>
          <li><a href="#home" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Home</a></li>
          <li><a href="#menu" onClick={(e) => { e.preventDefault(); setCurrentPage('menu'); }}>Menu</a></li>
          <li><a href="#orders" onClick={(e) => { e.preventDefault(); setCurrentPage('orders'); }}>Orders</a></li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="cart-icon" onClick={() => setCurrentPage('cart')} aria-label="Cart">
            <ShoppingCart />
            {cartCount > 0 && <div className="cart-badge">{cartCount}</div>}
          </button>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
            <MenuIcon />
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <button className="close-mobile-menu" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu"><X /></button>
        <a href="#home" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); setMobileMenuOpen(false); }}>Home</a>
        <a href="#menu" onClick={(e) => { e.preventDefault(); setCurrentPage('menu'); setMobileMenuOpen(false); }}>Menu</a>
        <a href="#orders" onClick={(e) => { e.preventDefault(); setCurrentPage('orders'); setMobileMenuOpen(false); }}>Orders</a>
      </div>
    </header>
  );

  const Hero = () => (
    <section className="hero">
      <h1>Delicious food, delivered fast</h1>
      <p>Discover popular dishes from top-rated restaurants near you. Order for delivery or pickup.</p>

      <div className="search-container">
        <Search className="search-icon" />
        <input
          className="search-bar"
          placeholder="Search restaurants or dishes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') setCurrentPage('menu'); }}
        />
      </div>

      <div className="cta-buttons">
        <button className="btn btn-primary" onClick={() => setCurrentPage('menu')}>Order Now</button>
        <button className="btn btn-secondary" onClick={() => setCurrentPage('menu')}>Browse Menu</button>
      </div>
    </section>
  );

  const Categories = () => (
    <section className="categories">
      <h2 className="section-title">Categories</h2>
      <div className="categories-grid">
        {categories.map(cat => (
          <div
            key={cat.id}
            className={`category-card ${selectedCategory === cat.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(prev => prev === cat.name ? '' : cat.name)}
          >
            <span className="category-icon" aria-hidden>{cat.icon}</span>
            <div className="category-name">{cat.name}</div>
          </div>
        ))}
      </div>
    </section>
  );

  const MenuControls = () => (
    <div className="menu-controls">
      <div className="filters">
        <select className="filter-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>

        <select className="filter-select" value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
          <option value="all">All Prices</option>
          <option value="low">Under $10</option>
          <option value="medium">$10 - $15</option>
          <option value="high">Above $15</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort: Name</option>
          <option value="price-low">Sort: Price (Low to High)</option>
          <option value="price-high">Sort: Price (High to Low)</option>
          <option value="rating">Sort: Rating</option>
        </select>
        <button className="btn btn-secondary" onClick={() => { setSearchTerm(''); setSelectedCategory(''); setPriceRange('all'); setSortBy('name'); }}>Reset</button>
      </div>
    </div>
  );

  const MenuGrid = () => (
    <div className="items-grid">
      {filteredItems.length === 0 && <div className="empty-state">No items found.</div>}
      {filteredItems.map(item => (
        <div key={item.id} className="item-card">
          <div className="item-image" style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} aria-hidden>
            {/* decorative */}
          </div>
          <div className="item-content">
            <div className="item-header">
              <div>
                <div className="item-name">{item.name}</div>
                <div className="item-description">{item.description}</div>
              </div>
              <div className="item-price">{currency(item.price)}</div>
            </div>

            <div className="item-footer">
              <div className="item-rating"><Star /> {item.rating}</div>
              <button className="add-to-cart" onClick={() => addToCart(item)}><Plus /> Add</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const Popular = () => (
    <section style={{ marginTop: '2rem' }}>
      <h2 className="section-title">Popular Right Now</h2>
      <div className="items-grid">
        {popularItems.map(item => (
          <div key={item.id} className="item-card">
            <div className="item-image" style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} aria-hidden />
            <div className="item-content">
              <div className="item-header">
                <div>
                  <div className="item-name">{item.name}</div>
                  <div className="item-description">{item.description}</div>
                </div>
                <div className="item-price">{currency(item.price)}</div>
              </div>

              <div className="item-footer">
                <div className="item-rating"><Star /> {item.rating}</div>
                <button className="add-to-cart" onClick={() => addToCart(item)}><Plus /> Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const CartPage = () => (
    <div className="cart-container">
      <h2 className="section-title">Your Cart</h2>
      {cart.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <p>Your cart is empty. Add some tasty items!</p>
        </div>
      )}

      {cart.map(item => (
        <div key={item.id} className="cart-item">
          <div className="cart-item-image" style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="cart-item-details">
            <div className="cart-item-name">{item.name}</div>
            <div className="cart-item-price">{currency(item.price)}</div>
            <div className="quantity-controls">
              <button className="quantity-btn" onClick={() => decreaseQty(item.id)} aria-label="Decrease"><Minus /></button>
              <div className="quantity">{item.quantity}</div>
              <button className="quantity-btn" onClick={() => increaseQty(item.id)} aria-label="Increase"><Plus /></button>
              <button className="remove-item" onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <div className="cart-summary">
          <div className="total-price">{currency(cartTotal)}</div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => setCurrentPage('menu')}>Continue Shopping</button>
            <button className="btn btn-primary" onClick={() => setCurrentPage('checkout')}>Checkout</button>
          </div>
        </div>
      )}
    </div>
  );

  const CheckoutPage = () => (
    <div className="checkout-container">
      <h2 className="section-title">Checkout</h2>

      <form onSubmit={handlePlaceOrder}>
        <div className="form-group">
          <label className="form-label">Full name</label>
          <input className="form-input" value={orderForm.name} onChange={(e) => setOrderForm(prev => ({ ...prev, name: e.target.value }))} />
        </div>

        <div className="form-group">
          <label className="form-label">Address</label>
          <input className="form-input" value={orderForm.address} onChange={(e) => setOrderForm(prev => ({ ...prev, address: e.target.value }))} />
        </div>

        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-input" value={orderForm.phone} onChange={(e) => setOrderForm(prev => ({ ...prev, phone: e.target.value }))} />
        </div>

        <div className="form-group">
          <label className="form-label">Email (optional)</label>
          <input className="form-input" value={orderForm.email} onChange={(e) => setOrderForm(prev => ({ ...prev, email: e.target.value }))} />
        </div>

        <div className="form-group">
          <div className="form-label">Payment Method</div>
          <div className="payment-options">
            <div className={`payment-option ${orderForm.paymentMethod === 'card' ? 'selected' : ''}`} onClick={() => setOrderForm(prev => ({ ...prev, paymentMethod: 'card' }))}><CreditCard /> Card</div>
            <div className={`payment-option ${orderForm.paymentMethod === 'cash' ? 'selected' : ''}`} onClick={() => setOrderForm(prev => ({ ...prev, paymentMethod: 'cash' }))}><CashIconFallback /> Cash</div>
          </div>
        </div>

        <div className="order-summary">
          <div className="summary-item"><div>Items</div><div>{cart.length}</div></div>
          <div className="summary-item"><div>Subtotal</div><div>{currency(cartTotal)}</div></div>
          <div className="summary-item summary-total"><div>Total</div><div>{currency(cartTotal)}</div></div>
        </div>

        <button className="place-order-btn" type="submit" disabled={isLoading}>
          {isLoading ? 'Placing order...' : 'Place Order'}
          {isLoading ? <Clock /> : <Check />}
        </button>
      </form>
    </div>
  );

  function CashIconFallback() {
    // lucide-react doesn't have a "Cash" import in above list; show a simple emoji fallback
    return <span style={{ fontSize: 18 }}>💵</span>;
  }

  const OrdersPage = () => (
    <div className="orders-container">
      <h2 className="section-title">Your Orders</h2>
      {orders.length === 0 && <div className="empty-state">No orders yet.</div>}
      {orders.map(o => (
        <div key={o.id} className="order-card">
          <div className="order-header">
            <div>
              <div className="order-id">{o.id}</div>
              <div style={{ color: '#64748b', fontSize: 12 }}>{o.date}</div>
            </div>
            <div className={`order-status ${o.status === 'pending' ? 'status-pending' : o.status === 'preparing' ? 'status-preparing' : 'status-delivered'}`}>
              {o.status}
            </div>
          </div>

          <div className="order-items">
            {o.items.map((it, idx) => (
              <div key={idx} className="order-item">
                <div>{it.quantity} × {it.name}</div>
                <div>{currency(it.price * it.quantity)}</div>
              </div>
            ))}
          </div>

          <div className="order-total">Total: {currency(o.total)}</div>
        </div>
      ))}
    </div>
  );

  /* Floating Cart button for mobile */
  const FloatingCart = () => (
    <button className={`floating-cart ${cartCount > 0 ? 'show' : ''}`} onClick={() => setCurrentPage('cart')} aria-label="Open cart">
      <ShoppingCart />
      <div style={{ marginLeft: 6, fontWeight: 700 }}>{cartCount}</div>
    </button>
  );

  /* Main render */
  return (
    <div className="app">
      <Header />

      <main className="main">
        {currentPage === 'home' && (
          <>
            <Hero />
            <Categories />
            <section>
              <h2 className="section-title">Menu Highlights</h2>
              <MenuGrid />
            </section>

            <Popular />
          </>
        )}

        {currentPage === 'menu' && (
          <>
            <h2 className="section-title">Menu</h2>
            <MenuControls />
            <MenuGrid />
          </>
        )}

        {currentPage === 'cart' && <CartPage />}

        {currentPage === 'checkout' && <CheckoutPage />}

        {currentPage === 'orders' && <OrdersPage />}
      </main>

      <FloatingCart />
    </div>
  );
}

/* --------------------------
   Render App
   -------------------------- */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;
