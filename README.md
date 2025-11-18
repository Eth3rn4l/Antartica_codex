# Antartica Codex

Aplicación React + Vite para la librería Antartica con vistas de cliente y administrador.
La estructura está organizada por dominios (api, hooks, context, pages) para separar
responsabilidades y permitir reutilización.

## Estructura del proyecto

```
src/
├── api/                  # cliente HTTP y servicios (productos, usuarios, carrito)
├── assets/               # imágenes y recursos estáticos
├── components/           # componentes reutilizables (Header, BookCard, Cart, etc.)
├── context/              # proveedores de autenticación y carrito
├── hooks/                # hooks para productos, usuario y carrito
├── pages/                # páginas (Home, Login, Admin, Perfil, etc.)
├── styles/               # estilos globales
├── utils/                # utilidades (RUT, formato de fecha, tarjeta, helpers)
├── App.jsx               # rutas y layout principal
└── main.jsx              # punto de entrada de React
```

## Scripts

- `npm run dev` — servidor de desarrollo con Vite.
- `npm run build` — compilación de la aplicación para producción.
- `npm run preview` — vista previa local del build de producción.
- `npm test` — suite de pruebas con Vitest.
- `npm run lint` — linting del código con ESLint.

## Notas

- Las rutas protegidas utilizan `ProtectedRoute` y el contexto de autenticación.
- El estado global del carrito se maneja con `CarritoContext` y el hook `useCarrito`.
- Los servicios de `src/api/services` agrupan llamadas HTTP a través del cliente configurado en
  `src/api/client.js`.
