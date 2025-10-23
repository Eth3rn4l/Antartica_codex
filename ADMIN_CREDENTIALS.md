# 🛡️ Sistema de Administrador - Antártica

## Credenciales de Administrador

Para acceder al panel de administración, utiliza las siguientes credenciales:

### Administrador Principal
- **Email:** `admin@antartica.cl`
- **Contraseña:** `admin123`

### Administrador de Ventas
- **Email:** `ventas@antartica.cl`
- **Contraseña:** `ventas123`

### Administrador de Inventario
- **Email:** `inventario@antartica.cl`
- **Contraseña:** `inventario123`

## 🚀 Cómo Probar el Sistema

1. **Ejecutar la aplicación:**
   ```bash
   npm run dev
   ```

2. **Acceder a la aplicación:**
   - Abrir: http://localhost:5173/

3. **Iniciar sesión como administrador:**
   - Hacer clic en el menú hamburguesa (☰) en la esquina superior derecha
   - Seleccionar "Login"
   - Ingresar cualquiera de las credenciales de administrador listadas arriba
   - El sistema detectará automáticamente que es un administrador y redirigirá al dashboard

4. **Explorar el Dashboard de Administrador:**
   - **Resumen:** Estadísticas generales y actividad reciente
   - **Productos:** Gestión de inventario y stock
   - **Clientes:** Administración de usuarios y historial de pedidos
   - **Pedidos:** Seguimiento de órdenes y estados

## 🎨 Características del Sistema

### Diseño Consistente
- ✅ Utiliza los mismos colores que el resto de la aplicación:
  - Azul oscuro: `#194C57`
  - Azul claro: `#B4E2ED`
  - Morado: `#646cff`

### Funcionalidades Implementadas
- ✅ Detección automática de administradores en el login
- ✅ Gestión de sesiones con localStorage
- ✅ Dashboard completo con múltiples secciones
- ✅ Navegación protegida (solo administradores pueden acceder)
- ✅ Logout con limpieza de sesión
- ✅ Interfaz responsiva y moderna

### Seguridad
- ✅ Validación de credenciales específicas para administradores
- ✅ Restricción de acceso a rutas administrativas
- ✅ Gestión segura de sesiones

## 📱 Navegación para Administradores

Cuando un administrador inicia sesión, el header mostrará:
- 👑 Indicador de rol de administrador
- Email del usuario logueado
- Acceso directo al "Dashboard Admin" en el menú

## 🔄 Flujo de Usuario Administrador

1. **Login** → Sistema detecta email de administrador
2. **Validación** → Verifica contraseña específica de admin
3. **Redirección** → Acceso automático al Dashboard
4. **Gestión** → Acceso completo a herramientas administrativas
5. **Logout** → Limpieza de sesión y regreso a home

## 🛠️ Archivos Modificados

- `src/App.jsx` - Gestión de rutas y estados de usuario
- `src/pages/Login.jsx` - Detección y validación de administradores
- `src/components/Header.jsx` - Menú dinámico según rol de usuario
- `src/pages/AdminDashboard.jsx` - Panel de control completo
- `src/utils/validadores.js` - Funciones de validación de admin
- `src/utils/constantes.js` - Configuración de administradores

¡El sistema está listo para usar! 🎉
