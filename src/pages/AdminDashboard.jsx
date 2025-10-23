// src/pages/AdminDashboard.jsx
import React, { useState } from 'react';

/**
 * Componente AdminDashboard
 * Panel de control principal para administradores
 * Permite gestionar productos, clientes y ver estadísticas
 */
function AdminDashboard({ onNavigate, onLogout }) {
  const [activeSection, setActiveSection] = useState('overview');

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'products':
        return <ProductsSection />;
      case 'customers':
        return <CustomersSection />;
      case 'orders':
        return <OrdersSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div style={containerStyle}>
      {/* Header del Dashboard */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Panel de Administración - Antártica</h1>
        <div style={headerActionsStyle}>
          <button 
            onClick={() => onNavigate('home')} 
            style={secondaryButtonStyle}
          >
            Volver a Tienda
          </button>
          <button onClick={onLogout} style={logoutButtonStyle}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div style={dashboardContentStyle}>
        {/* Sidebar de navegación */}
        <div style={sidebarStyle}>
          <nav style={navStyle}>
            <button
              onClick={() => handleSectionChange('overview')}
              style={activeSection === 'overview' ? activeNavButtonStyle : navButtonStyle}
            >
              📊 Resumen General
            </button>
            <button
              onClick={() => handleSectionChange('products')}
              style={activeSection === 'products' ? activeNavButtonStyle : navButtonStyle}
            >
              📚 Gestión de Productos
            </button>
            <button
              onClick={() => handleSectionChange('customers')}
              style={activeSection === 'customers' ? activeNavButtonStyle : navButtonStyle}
            >
              👥 Gestión de Clientes
            </button>
            <button
              onClick={() => handleSectionChange('orders')}
              style={activeSection === 'orders' ? activeNavButtonStyle : navButtonStyle}
            >
              📦 Pedidos
            </button>
          </nav>
        </div>

        {/* Contenido principal */}
        <div style={mainContentStyle}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Componente de Resumen General
function OverviewSection() {
  const stats = {
    totalProducts: 156,
    totalCustomers: 1247,
    pendingOrders: 23,
    monthlyRevenue: '$2.450.000'
  };

  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Resumen General</h2>
      
      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <div style={statIconStyle}>📚</div>
          <div style={statContentStyle}>
            <h3 style={statNumberStyle}>{stats.totalProducts}</h3>
            <p style={statLabelStyle}>Productos Total</p>
          </div>
        </div>
        
        <div style={statCardStyle}>
          <div style={statIconStyle}>👥</div>
          <div style={statContentStyle}>
            <h3 style={statNumberStyle}>{stats.totalCustomers}</h3>
            <p style={statLabelStyle}>Clientes Registrados</p>
          </div>
        </div>
        
        <div style={statCardStyle}>
          <div style={statIconStyle}>📦</div>
          <div style={statContentStyle}>
            <h3 style={statNumberStyle}>{stats.pendingOrders}</h3>
            <p style={statLabelStyle}>Pedidos Pendientes</p>
          </div>
        </div>
        
        <div style={statCardStyle}>
          <div style={statIconStyle}>💰</div>
          <div style={statContentStyle}>
            <h3 style={statNumberStyle}>{stats.monthlyRevenue}</h3>
            <p style={statLabelStyle}>Ingresos del Mes</p>
          </div>
        </div>
      </div>

      <div style={recentActivityStyle}>
        <h3 style={subsectionTitleStyle}>Actividad Reciente</h3>
        <div style={activityListStyle}>
          <div style={activityItemStyle}>
            <span style={activityTimeStyle}>Hace 2 horas</span>
            <span style={activityTextStyle}>Nuevo cliente registrado: María González</span>
          </div>
          <div style={activityItemStyle}>
            <span style={activityTimeStyle}>Hace 4 horas</span>
            <span style={activityTextStyle}>Producto agotado: El Principito</span>
          </div>
          <div style={activityItemStyle}>
            <span style={activityTimeStyle}>Hace 6 horas</span>
            <span style={activityTextStyle}>Pedido completado: #1247</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Gestión de Productos
function ProductsSection() {
  const [products] = useState([
    { id: 1, title: 'El Principito', author: 'Antoine de Saint-Exupéry', stock: 15, price: 12990 },
    { id: 2, title: '1984', author: 'George Orwell', stock: 8, price: 15990 },
    { id: 3, title: 'Cien años de soledad', author: 'Gabriel García Márquez', stock: 0, price: 18990 },
  ]);

  return (
    <div style={sectionStyle}>
      <div style={sectionHeaderStyle}>
        <h2 style={sectionTitleStyle}>Gestión de Productos</h2>
        <button style={primaryButtonStyle}>+ Agregar Producto</button>
      </div>

      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={thStyle}>Título</th>
              <th style={thStyle}>Autor</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Precio</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={tableRowStyle}>
                <td style={tdStyle}>{product.title}</td>
                <td style={tdStyle}>{product.author}</td>
                <td style={{...tdStyle, color: product.stock === 0 ? '#f87171' : '#059669'}}>
                  {product.stock === 0 ? 'Agotado' : product.stock}
                </td>
                <td style={tdStyle}>${product.price.toLocaleString()}</td>
                <td style={tdStyle}>
                  <button style={editButtonStyle}>Editar</button>
                  <button style={deleteButtonStyle}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente de Gestión de Clientes
function CustomersSection() {
  const [customers] = useState([
    { id: 1, name: 'Juan Pérez', email: 'juan@email.com', orders: 5, lastOrder: '2024-10-20' },
    { id: 2, name: 'María González', email: 'maria@email.com', orders: 2, lastOrder: '2024-10-22' },
    { id: 3, name: 'Carlos Ruiz', email: 'carlos@email.com', orders: 8, lastOrder: '2024-10-21' },
  ]);

  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Gestión de Clientes</h2>

      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Pedidos</th>
              <th style={thStyle}>Último Pedido</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id} style={tableRowStyle}>
                <td style={tdStyle}>{customer.name}</td>
                <td style={tdStyle}>{customer.email}</td>
                <td style={tdStyle}>{customer.orders}</td>
                <td style={tdStyle}>{customer.lastOrder}</td>
                <td style={tdStyle}>
                  <button style={editButtonStyle}>Ver Detalle</button>
                  <button style={deleteButtonStyle}>Desactivar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente de Pedidos
function OrdersSection() {
  const [orders] = useState([
    { id: 1247, customer: 'Juan Pérez', total: 28980, status: 'Pendiente', date: '2024-10-22' },
    { id: 1246, customer: 'María González', total: 15990, status: 'Enviado', date: '2024-10-21' },
    { id: 1245, customer: 'Carlos Ruiz', total: 42990, status: 'Entregado', date: '2024-10-20' },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente': return '#f59e0b';
      case 'Enviado': return '#3b82f6';
      case 'Entregado': return '#059669';
      default: return '#6b7280';
    }
  };

  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Gestión de Pedidos</h2>

      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={thStyle}>Pedido #</th>
              <th style={thStyle}>Cliente</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Fecha</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={tableRowStyle}>
                <td style={tdStyle}>#{order.id}</td>
                <td style={tdStyle}>{order.customer}</td>
                <td style={tdStyle}>${order.total.toLocaleString()}</td>
                <td style={{...tdStyle, color: getStatusColor(order.status), fontWeight: '600'}}>
                  {order.status}
                </td>
                <td style={tdStyle}>{order.date}</td>
                <td style={tdStyle}>
                  <button style={editButtonStyle}>Ver Detalle</button>
                  <button style={primaryButtonStyle}>Actualizar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================
   Estilos del Dashboard
   ========================= */

const containerStyle = {
  minHeight: '100vh',
  background: 'var(--color-bg-light)',
  fontFamily: 'Arial, sans-serif',
};

const headerStyle = {
  background: '#194C57',
  color: 'white',
  padding: '1rem 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const titleStyle = {
  margin: 0,
  fontSize: '1.5rem',
  fontWeight: '600',
};

const headerActionsStyle = {
  display: 'flex',
  gap: '1rem',
};

const dashboardContentStyle = {
  display: 'flex',
  minHeight: 'calc(100vh - 80px)',
};

const sidebarStyle = {
  width: '250px',
  background: '#B4E2ED',
  borderRight: '1px solid #646cff',
  padding: '2rem 0',
};

const navStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  padding: '0 1rem',
};

const navButtonStyle = {
  background: 'transparent',
  border: 'none',
  padding: '1rem',
  textAlign: 'left',
  cursor: 'pointer',
  borderRadius: '8px',
  color: '#194C57',
  fontSize: '0.95rem',
  fontWeight: '500',
  transition: 'background 0.2s',
};

const activeNavButtonStyle = {
  ...navButtonStyle,
  background: '#194C57',
  color: 'white',
};

const mainContentStyle = {
  flex: 1,
  padding: '2rem',
  background: '#f8fafc',
};

const sectionStyle = {
  background: 'white',
  borderRadius: '12px',
  padding: '2rem',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
};

const sectionHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: '1.8rem',
  fontWeight: '600',
  color: '#194C57',
};

const subsectionTitleStyle = {
  margin: '0 0 1rem 0',
  fontSize: '1.2rem',
  fontWeight: '600',
  color: '#194C57',
};

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '1.5rem',
  marginBottom: '2rem',
};

const statCardStyle = {
  background: '#B4E2ED',
  borderRadius: '12px',
  padding: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  border: '1px solid #646cff',
};

const statIconStyle = {
  fontSize: '2.5rem',
};

const statContentStyle = {
  flex: 1,
};

const statNumberStyle = {
  margin: '0 0 0.25rem 0',
  fontSize: '1.8rem',
  fontWeight: '700',
  color: '#194C57',
};

const statLabelStyle = {
  margin: 0,
  fontSize: '0.9rem',
  color: '#6b7280',
};

const recentActivityStyle = {
  marginTop: '2rem',
};

const activityListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const activityItemStyle = {
  display: 'flex',
  gap: '1rem',
  padding: '0.75rem',
  background: '#f8fafc',
  borderRadius: '6px',
  border: '1px solid #e5e7eb',
};

const activityTimeStyle = {
  color: '#6b7280',
  fontSize: '0.85rem',
  minWidth: '100px',
};

const activityTextStyle = {
  color: '#374151',
  fontSize: '0.9rem',
};

const tableContainerStyle = {
  overflowX: 'auto',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const tableHeaderStyle = {
  background: '#f8fafc',
};

const thStyle = {
  padding: '1rem',
  textAlign: 'left',
  fontWeight: '600',
  color: '#374151',
  borderBottom: '1px solid #e5e7eb',
};

const tableRowStyle = {
  borderBottom: '1px solid #f3f4f6',
};

const tdStyle = {
  padding: '1rem',
  color: '#6b7280',
};

const primaryButtonStyle = {
  background: '#194C57',
  color: 'white',
  border: 'none',
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: '600',
  transition: 'background 0.2s',
};

const secondaryButtonStyle = {
  background: 'transparent',
  color: 'white',
  border: '1px solid white',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.85rem',
  transition: 'background 0.2s',
};

const logoutButtonStyle = {
  background: '#f87171',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.85rem',
  transition: 'background 0.2s',
};

const editButtonStyle = {
  background: '#3b82f6',
  color: 'white',
  border: 'none',
  padding: '0.4rem 0.8rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.8rem',
  marginRight: '0.5rem',
};

const deleteButtonStyle = {
  background: '#f87171',
  color: 'white',
  border: 'none',
  padding: '0.4rem 0.8rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.8rem',
};

export default AdminDashboard;
