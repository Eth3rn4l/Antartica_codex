import { describe, it, expect } from 'vitest';
import {
  API_ENDPOINTS,
  APP_CONFIG,
  BOOK_CATEGORIES,
  CATEGORY_LABELS,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  CHILEAN_REGIONS,
  REGION_LABELS,
  VALIDATION_CONFIG,
  ERROR_MESSAGES,
  STORAGE_KEYS,
  UI_CONFIG,
  ROUTES
} from '../utils/constantes.js';

describe('Constants', () => {
  describe('API_ENDPOINTS', () => {
    it('debe tener todas las URLs necesarias', () => {
      expect(API_ENDPOINTS).toHaveProperty('BASE_URL');
      expect(API_ENDPOINTS).toHaveProperty('BOOKS');
      expect(API_ENDPOINTS).toHaveProperty('USERS');
      expect(API_ENDPOINTS).toHaveProperty('ORDERS');
      expect(API_ENDPOINTS).toHaveProperty('AUTH');
    });

    it('debe tener endpoints válidos', () => {
      expect(API_ENDPOINTS.BOOKS).toBe('/api/books');
      expect(API_ENDPOINTS.USERS).toBe('/api/users');
      expect(API_ENDPOINTS.ORDERS).toBe('/api/orders');
      expect(API_ENDPOINTS.AUTH).toBe('/api/auth');
    });
  });

  describe('APP_CONFIG', () => {
    it('debe tener configuración de aplicación completa', () => {
      expect(APP_CONFIG).toHaveProperty('NAME');
      expect(APP_CONFIG).toHaveProperty('VERSION');
      expect(APP_CONFIG).toHaveProperty('DESCRIPTION');
      expect(APP_CONFIG).toHaveProperty('DEFAULT_PAGE_SIZE');
      expect(APP_CONFIG).toHaveProperty('MAX_CART_ITEMS');
    });

    it('debe tener valores correctos', () => {
      expect(APP_CONFIG.NAME).toBe('Antártica');
      expect(APP_CONFIG.VERSION).toBe('1.0.0');
      expect(typeof APP_CONFIG.DEFAULT_PAGE_SIZE).toBe('number');
      expect(typeof APP_CONFIG.MAX_CART_ITEMS).toBe('number');
    });
  });

  describe('BOOK_CATEGORIES', () => {
    it('debe tener categorías de libros', () => {
      expect(BOOK_CATEGORIES).toHaveProperty('FICCION');
      expect(BOOK_CATEGORIES).toHaveProperty('NO_FICCION');
      expect(BOOK_CATEGORIES).toHaveProperty('INFANTIL');
      expect(BOOK_CATEGORIES).toHaveProperty('JUVENIL');
      expect(BOOK_CATEGORIES).toHaveProperty('ACADEMICO');
    });

    it('debe tener valores string en formato slug', () => {
      Object.values(BOOK_CATEGORIES).forEach(category => {
        expect(typeof category).toBe('string');
        expect(category).toMatch(/^[a-z-]+$/); // Solo letras minúsculas y guiones
      });
    });
  });

  describe('CATEGORY_LABELS', () => {
    it('debe tener labels para todas las categorías', () => {
      Object.keys(BOOK_CATEGORIES).forEach(categoryKey => {
        const categoryValue = BOOK_CATEGORIES[categoryKey];
        expect(CATEGORY_LABELS).toHaveProperty(categoryValue);
      });
    });

    it('debe tener labels descriptivos', () => {
      expect(CATEGORY_LABELS[BOOK_CATEGORIES.FICCION]).toBe('Ficción');
      expect(CATEGORY_LABELS[BOOK_CATEGORIES.NO_FICCION]).toBe('No Ficción');
      expect(CATEGORY_LABELS[BOOK_CATEGORIES.INFANTIL]).toBe('Infantil');
    });
  });

  describe('ORDER_STATUS', () => {
    it('debe tener estados de pedido', () => {
      expect(ORDER_STATUS).toHaveProperty('PENDING');
      expect(ORDER_STATUS).toHaveProperty('CONFIRMED');
      expect(ORDER_STATUS).toHaveProperty('SHIPPED');
      expect(ORDER_STATUS).toHaveProperty('DELIVERED');
      expect(ORDER_STATUS).toHaveProperty('CANCELLED');
    });

    it('debe tener labels para todos los estados', () => {
      Object.values(ORDER_STATUS).forEach(status => {
        expect(ORDER_STATUS_LABELS).toHaveProperty(status);
        expect(typeof ORDER_STATUS_LABELS[status]).toBe('string');
      });
    });
  });

  describe('PAYMENT_METHODS', () => {
    it('debe tener métodos de pago', () => {
      expect(PAYMENT_METHODS).toHaveProperty('CREDIT_CARD');
      expect(PAYMENT_METHODS).toHaveProperty('DEBIT_CARD');
      expect(PAYMENT_METHODS).toHaveProperty('TRANSFER');
      expect(PAYMENT_METHODS).toHaveProperty('CASH');
    });

    it('debe tener labels para todos los métodos', () => {
      Object.values(PAYMENT_METHODS).forEach(method => {
        expect(PAYMENT_METHOD_LABELS).toHaveProperty(method);
        expect(typeof PAYMENT_METHOD_LABELS[method]).toBe('string');
      });
    });
  });

  describe('CHILEAN_REGIONS', () => {
    it('debe tener todas las regiones de Chile', () => {
      expect(Object.keys(CHILEAN_REGIONS)).toHaveLength(16);
      expect(CHILEAN_REGIONS).toHaveProperty('METROPOLITANA');
      expect(CHILEAN_REGIONS).toHaveProperty('VALPARAISO');
      expect(CHILEAN_REGIONS).toHaveProperty('BIOBIO');
    });

    it('debe tener labels para todas las regiones', () => {
      Object.values(CHILEAN_REGIONS).forEach(region => {
        expect(REGION_LABELS).toHaveProperty(region);
        expect(typeof REGION_LABELS[region]).toBe('string');
      });
    });

    it('debe tener labels descriptivos de regiones', () => {
      expect(REGION_LABELS[CHILEAN_REGIONS.METROPOLITANA]).toBe('Metropolitana');
      expect(REGION_LABELS[CHILEAN_REGIONS.VALPARAISO]).toBe('Valparaíso');
      expect(REGION_LABELS[CHILEAN_REGIONS.BIOBIO]).toBe('Biobío');
    });
  });

  describe('VALIDATION_CONFIG', () => {
    it('debe tener configuración de validación para email', () => {
      expect(VALIDATION_CONFIG.EMAIL).toHaveProperty('MIN_LENGTH');
      expect(VALIDATION_CONFIG.EMAIL).toHaveProperty('MAX_LENGTH');
      expect(VALIDATION_CONFIG.EMAIL).toHaveProperty('PATTERN');
      expect(VALIDATION_CONFIG.EMAIL.PATTERN).toBeInstanceOf(RegExp);
    });

    it('debe tener configuración de validación para password', () => {
      expect(VALIDATION_CONFIG.PASSWORD).toHaveProperty('MIN_LENGTH');
      expect(VALIDATION_CONFIG.PASSWORD).toHaveProperty('MAX_LENGTH');
      expect(typeof VALIDATION_CONFIG.PASSWORD.MIN_LENGTH).toBe('number');
    });

    it('debe tener patrones regex válidos', () => {
      expect(VALIDATION_CONFIG.PHONE.PATTERN).toBeInstanceOf(RegExp);
      expect(VALIDATION_CONFIG.RUT.PATTERN).toBeInstanceOf(RegExp);
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('debe tener mensajes de error en español', () => {
      expect(ERROR_MESSAGES.REQUIRED_FIELD).toBe('Este campo es obligatorio');
      expect(ERROR_MESSAGES.INVALID_EMAIL).toBe('Ingresa un email válido');
      expect(ERROR_MESSAGES.PASSWORDS_NO_MATCH).toBe('Las contraseñas no coinciden');
    });

    it('debe tener todos los mensajes necesarios', () => {
      expect(ERROR_MESSAGES).toHaveProperty('REQUIRED_FIELD');
      expect(ERROR_MESSAGES).toHaveProperty('INVALID_EMAIL');
      expect(ERROR_MESSAGES).toHaveProperty('INVALID_PHONE');
      expect(ERROR_MESSAGES).toHaveProperty('INVALID_RUT');
      expect(ERROR_MESSAGES).toHaveProperty('PASSWORD_TOO_SHORT');
      expect(ERROR_MESSAGES).toHaveProperty('PASSWORDS_NO_MATCH');
      expect(ERROR_MESSAGES).toHaveProperty('GENERIC_ERROR');
    });
  });

  describe('STORAGE_KEYS', () => {
    it('debe tener claves de localStorage', () => {
      expect(STORAGE_KEYS).toHaveProperty('CART_ITEMS');
      expect(STORAGE_KEYS).toHaveProperty('USER_PREFERENCES');
      expect(STORAGE_KEYS).toHaveProperty('SEARCH_HISTORY');
      expect(STORAGE_KEYS).toHaveProperty('USER_SESSION');
    });

    it('debe tener valores string', () => {
      Object.values(STORAGE_KEYS).forEach(key => {
        expect(typeof key).toBe('string');
        expect(key.length).toBeGreaterThan(0);
      });
    });
  });

  describe('UI_CONFIG', () => {
    it('debe tener configuración de interfaz', () => {
      expect(UI_CONFIG).toHaveProperty('DEBOUNCE_DELAY');
      expect(UI_CONFIG).toHaveProperty('ANIMATION_DURATION');
      expect(UI_CONFIG).toHaveProperty('TOAST_DURATION');
      expect(UI_CONFIG).toHaveProperty('LOADING_MIN_TIME');
    });

    it('debe tener valores numéricos positivos', () => {
      Object.values(UI_CONFIG).forEach(value => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThan(0);
      });
    });
  });

  describe('ROUTES', () => {
    it('debe tener rutas de la aplicación', () => {
      expect(ROUTES).toHaveProperty('HOME');
      expect(ROUTES).toHaveProperty('LOGIN');
      expect(ROUTES).toHaveProperty('REGISTER');
      expect(ROUTES).toHaveProperty('CART');
      expect(ROUTES).toHaveProperty('HELP');
      expect(ROUTES).toHaveProperty('CONTACT');
      expect(ROUTES).toHaveProperty('ABOUT');
    });

    it('debe tener rutas válidas', () => {
      expect(ROUTES.HOME).toBe('/');
      expect(ROUTES.LOGIN).toBe('/login');
      expect(ROUTES.REGISTER).toBe('/register');
      expect(ROUTES.HELP).toBe('/ayuda');
    });

    it('debe tener rutas dinámicas correctas', () => {
      expect(ROUTES.BOOK_DETAIL).toBe('/libro/:id');
      expect(ROUTES.CATEGORY).toBe('/categoria/:category');
    });
  });
});
