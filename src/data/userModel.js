/**
 * ===================================================
 * USER MODEL - GESTIÓN DE USUARIOS
 * ===================================================
 * 
 * Modelo para la gestión de usuarios del sistema Antártica.
 * Incluye operaciones CRUD y validaciones específicas.
 * 
 * FUNCIONALIDADES:
 * - Registro y autenticación de usuarios
 * - Gestión de roles (client, admin, superadmin)
 * - Validación de datos chilenos (RUT, teléfono)
 * - Encriptación de contraseñas
 * - Gestión de sesiones
 * 
 * AUTOR: Sistema Antártica
 * FECHA: Octubre 2025
 * ===================================================
 */

import { dbManager } from './database.js';
import { validateEmail, validateChileanPhone, validateAdmin } from '../utils/validadores.js';
import { ADMIN_CONFIG } from '../utils/constantes.js';

// ===================================================
// CLASE USER MODEL
// ===================================================

/**
 * Clase UserModel
 * Maneja todas las operaciones relacionadas con usuarios
 */
export class UserModel {
  constructor() {
    this.tableName = 'usuarios';
  }

  /**
   * Crea un nuevo usuario en la base de datos
   * @param {Object} userData - Datos del usuario a crear
   * @param {string} userData.email - Correo electrónico único
   * @param {string} userData.password - Contraseña en texto plano
   * @param {string} userData.nombre - Nombre completo
   * @param {string} userData.telefono - Teléfono chileno (opcional)
   * @returns {Promise<Object>} Usuario creado con ID asignado
   */
  async createUser(userData) {
    try {
      console.log('👤 Creando nuevo usuario:', userData.email);
      
      // Validar datos de entrada
      this.validateUserData(userData);
      
      // Verificar que el email no existe
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('El correo electrónico ya está registrado');
      }

      // Determinar el rol del usuario
      const rol = validateAdmin(userData.email) ? 'admin' : 'client';
      
      // Encriptar contraseña
      const passwordHash = await this.hashPassword(userData.password);
      
      // Preparar datos para inserción
      const userToCreate = {
        email: userData.email.toLowerCase().trim(),
        password_hash: passwordHash,
        nombre: userData.nombre.trim(),
        telefono: userData.telefono ? userData.telefono.trim() : null,
        rol: rol,
        estado: 'active',
        fecha_registro: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      };

      // Insertar en base de datos
      const query = `
        INSERT INTO ${this.tableName} 
        (email, password_hash, nombre, telefono, rol, estado, fecha_registro, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        userToCreate.email,
        userToCreate.password_hash,
        userToCreate.nombre,
        userToCreate.telefono,
        userToCreate.rol,
        userToCreate.estado,
        userToCreate.fecha_registro,
        userToCreate.created_at,
        userToCreate.updated_at
      ];

      const result = await dbManager.executeQuery(query, params);
      
      // Obtener el usuario creado
      const newUser = await this.findById(result.insertId);
      
      console.log('✅ Usuario creado exitosamente:', newUser.email);
      return this.sanitizeUser(newUser);
      
    } catch (error) {
      console.error('❌ Error al crear usuario:', error);
      throw error;
    }
  }

  /**
   * Busca un usuario por su ID
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  async findById(userId) {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE id = ? AND estado != 'deleted'`;
      const result = await dbManager.executeQuery(query, [userId]);
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('❌ Error al buscar usuario por ID:', error);
      throw error;
    }
  }

  /**
   * Busca un usuario por su email
   * @param {string} email - Correo electrónico del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  async findByEmail(email) {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE email = ? AND estado != 'deleted'`;
      const result = await dbManager.executeQuery(query, [email.toLowerCase().trim()]);
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('❌ Error al buscar usuario por email:', error);
      throw error;
    }
  }

  /**
   * Autentica un usuario con email y contraseña
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña en texto plano
   * @returns {Promise<Object|null>} Usuario autenticado o null
   */
  async authenticateUser(email, password) {
    try {
      console.log('🔐 Autenticando usuario:', email);
      
      // Buscar usuario por email
      const user = await this.findByEmail(email);
      if (!user) {
        console.log('❌ Usuario no encontrado:', email);
        return null;
      }

      // Verificar estado del usuario
      if (user.estado !== 'active') {
        console.log('❌ Usuario inactivo:', email);
        throw new Error('Cuenta de usuario inactiva');
      }

      // Verificar contraseña
      const passwordValid = await this.verifyPassword(password, user.password_hash);
      if (!passwordValid) {
        console.log('❌ Contraseña incorrecta para:', email);
        return null;
      }

      // Actualizar última conexión
      await this.updateLastLogin(user.id);
      
      console.log('✅ Usuario autenticado exitosamente:', email);
      return this.sanitizeUser(user);
      
    } catch (error) {
      console.error('❌ Error en autenticación:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los usuarios con paginación
   * @param {Object} options - Opciones de consulta
   * @param {number} options.page - Página actual (default: 1)
   * @param {number} options.limit - Usuarios por página (default: 20)
   * @param {string} options.search - Término de búsqueda (opcional)
   * @param {string} options.rol - Filtro por rol (opcional)
   * @returns {Promise<Object>} Lista paginada de usuarios
   */
  async getAllUsers(options = {}) {
    try {
      const { page = 1, limit = 20, search = '', rol = '' } = options;
      const offset = (page - 1) * limit;

      let whereClause = "WHERE estado != 'deleted'";
      const params = [];

      // Filtro de búsqueda
      if (search) {
        whereClause += " AND (nombre LIKE ? OR email LIKE ?)";
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm);
      }

      // Filtro por rol
      if (rol) {
        whereClause += " AND rol = ?";
        params.push(rol);
      }

      // Consulta principal
      const query = `
        SELECT id, email, nombre, telefono, rol, estado, fecha_registro, ultima_conexion
        FROM ${this.tableName} 
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;
      params.push(limit, offset);

      // Consulta de conteo
      const countQuery = `SELECT COUNT(*) as total FROM ${this.tableName} ${whereClause}`;
      const countParams = params.slice(0, -2); // Excluir LIMIT y OFFSET

      const [result, countResult] = await Promise.all([
        dbManager.executeQuery(query, params),
        dbManager.executeQuery(countQuery, countParams)
      ]);

      const total = countResult.rows[0].total;
      const totalPages = Math.ceil(total / limit);

      return {
        users: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
      
    } catch (error) {
      console.error('❌ Error al obtener usuarios:', error);
      throw error;
    }
  }

  /**
   * Actualiza los datos de un usuario
   * @param {number} userId - ID del usuario a actualizar
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  async updateUser(userId, updateData) {
    try {
      console.log('✏️ Actualizando usuario:', userId);
      
      // Validar que el usuario existe
      const existingUser = await this.findById(userId);
      if (!existingUser) {
        throw new Error('Usuario no encontrado');
      }

      // Preparar campos a actualizar
      const allowedFields = ['nombre', 'telefono', 'estado'];
      const fieldsToUpdate = [];
      const params = [];

      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          fieldsToUpdate.push(`${field} = ?`);
          params.push(updateData[field]);
        }
      }

      if (fieldsToUpdate.length === 0) {
        throw new Error('No hay campos válidos para actualizar');
      }

      // Agregar updated_at
      fieldsToUpdate.push('updated_at = ?');
      params.push(new Date());
      
      // Agregar userId al final
      params.push(userId);

      const query = `
        UPDATE ${this.tableName} 
        SET ${fieldsToUpdate.join(', ')}
        WHERE id = ?
      `;

      await dbManager.executeQuery(query, params);
      
      // Retornar usuario actualizado
      const updatedUser = await this.findById(userId);
      console.log('✅ Usuario actualizado exitosamente:', userId);
      
      return this.sanitizeUser(updatedUser);
      
    } catch (error) {
      console.error('❌ Error al actualizar usuario:', error);
      throw error;
    }
  }

  /**
   * Actualiza la contraseña de un usuario
   * @param {number} userId - ID del usuario
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<boolean>} True si se actualizó exitosamente
   */
  async updatePassword(userId, currentPassword, newPassword) {
    try {
      console.log('🔑 Actualizando contraseña para usuario:', userId);
      
      const user = await this.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const currentPasswordValid = await this.verifyPassword(currentPassword, user.password_hash);
      if (!currentPasswordValid) {
        throw new Error('Contraseña actual incorrecta');
      }

      // Encriptar nueva contraseña
      const newPasswordHash = await this.hashPassword(newPassword);
      
      const query = `
        UPDATE ${this.tableName} 
        SET password_hash = ?, updated_at = ?
        WHERE id = ?
      `;
      
      await dbManager.executeQuery(query, [newPasswordHash, new Date(), userId]);
      
      console.log('✅ Contraseña actualizada exitosamente para usuario:', userId);
      return true;
      
    } catch (error) {
      console.error('❌ Error al actualizar contraseña:', error);
      throw error;
    }
  }

  /**
   * Elimina (desactiva) un usuario
   * @param {number} userId - ID del usuario a eliminar
   * @returns {Promise<boolean>} True si se eliminó exitosamente
   */
  async deleteUser(userId) {
    try {
      console.log('🗑️ Eliminando usuario:', userId);
      
      const user = await this.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Soft delete: cambiar estado a 'deleted'
      const query = `
        UPDATE ${this.tableName} 
        SET estado = 'deleted', updated_at = ?
        WHERE id = ?
      `;
      
      await dbManager.executeQuery(query, [new Date(), userId]);
      
      console.log('✅ Usuario eliminado exitosamente:', userId);
      return true;
      
    } catch (error) {
      console.error('❌ Error al eliminar usuario:', error);
      throw error;
    }
  }

  /**
   * Actualiza la última conexión del usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<void>}
   */
  async updateLastLogin(userId) {
    try {
      const query = `
        UPDATE ${this.tableName} 
        SET ultima_conexion = ?, updated_at = ?
        WHERE id = ?
      `;
      
      await dbManager.executeQuery(query, [new Date(), new Date(), userId]);
    } catch (error) {
      console.error('❌ Error al actualizar última conexión:', error);
      // No lanzar error, es una operación secundaria
    }
  }

  /**
   * Valida los datos de usuario antes de crear/actualizar
   * @param {Object} userData - Datos del usuario a validar
   * @throws {Error} Si los datos no son válidos
   */
  validateUserData(userData) {
    if (!userData.email || !validateEmail(userData.email)) {
      throw new Error('Email inválido');
    }

    if (!userData.nombre || userData.nombre.trim().length < 2) {
      throw new Error('Nombre debe tener al menos 2 caracteres');
    }

    if (userData.telefono && !validateChileanPhone(userData.telefono)) {
      throw new Error('Teléfono chileno inválido');
    }

    if (!userData.password || userData.password.length < 6) {
      throw new Error('Contraseña debe tener al menos 6 caracteres');
    }
  }

  /**
   * Encripta una contraseña usando bcrypt
   * @param {string} password - Contraseña en texto plano
   * @returns {Promise<string>} Hash de la contraseña
   */
  async hashPassword(password) {
    try {
      // TODO: Implementar bcrypt real
      // const bcrypt = require('bcrypt');
      // return await bcrypt.hash(password, 12);
      
      // Simulación temporal (NO USAR EN PRODUCCIÓN)
      return `hashed_${password}_${Date.now()}`;
    } catch (error) {
      console.error('❌ Error al encriptar contraseña:', error);
      throw new Error('Error interno al procesar contraseña');
    }
  }

  /**
   * Verifica una contraseña contra su hash
   * @param {string} password - Contraseña en texto plano
   * @param {string} hash - Hash almacenado
   * @returns {Promise<boolean>} True si la contraseña es correcta
   */
  async verifyPassword(password, hash) {
    try {
      // TODO: Implementar bcrypt real
      // const bcrypt = require('bcrypt');
      // return await bcrypt.compare(password, hash);
      
      // Simulación temporal para desarrollo
      // En producción, verificar contra administradores predefinidos
      const adminCredentials = ADMIN_CONFIG.ADMIN_CREDENTIALS;
      
      for (const admin of adminCredentials) {
        if (hash.includes('admin') && admin.password === password) {
          return true;
        }
      }
      
      // Para usuarios regulares, simulación básica
      return hash.includes(password);
    } catch (error) {
      console.error('❌ Error al verificar contraseña:', error);
      return false;
    }
  }

  /**
   * Limpia los datos sensibles del objeto usuario
   * @param {Object} user - Usuario completo
   * @returns {Object} Usuario sin datos sensibles
   */
  sanitizeUser(user) {
    if (!user) return null;
    
    const { password_hash, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  /**
   * Obtiene estadísticas de usuarios para el dashboard admin
   * @returns {Promise<Object>} Estadísticas de usuarios
   */
  async getUserStats() {
    try {
      const queries = {
        total: `SELECT COUNT(*) as count FROM ${this.tableName} WHERE estado != 'deleted'`,
        active: `SELECT COUNT(*) as count FROM ${this.tableName} WHERE estado = 'active'`,
        admins: `SELECT COUNT(*) as count FROM ${this.tableName} WHERE rol = 'admin' AND estado != 'deleted'`,
        newThisMonth: `
          SELECT COUNT(*) as count FROM ${this.tableName} 
          WHERE fecha_registro >= DATE_SUB(NOW(), INTERVAL 1 MONTH) 
          AND estado != 'deleted'
        `
      };

      const results = await Promise.all(
        Object.entries(queries).map(async ([key, query]) => {
          const result = await dbManager.executeQuery(query);
          return [key, result.rows[0].count];
        })
      );

      return Object.fromEntries(results);
    } catch (error) {
      console.error('❌ Error al obtener estadísticas de usuarios:', error);
      throw error;
    }
  }
}

// ===================================================
// INSTANCIA SINGLETON DEL MODELO DE USUARIOS
// ===================================================

/**
 * Instancia única del modelo de usuarios
 * Se exporta para uso en toda la aplicación
 */
export const userModel = new UserModel();

/**
 * Función de utilidad para obtener el modelo de usuarios
 * @returns {UserModel} Instancia del modelo de usuarios
 */
export const getUserModel = () => userModel;

// ===================================================
// EXPORTACIÓN POR DEFECTO
// ===================================================

export default userModel;
