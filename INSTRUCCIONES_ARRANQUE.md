# Instrucciones de Ejecución - Backend Monolítico Gestión Médica

La arquitectura ha sido unificada en una única aplicación en la carpeta `src/`, manteniendo la modularidad y las tecnologías de infraestructura solicitadas.

## 📦 Stack Tecnológico Integrado
- **API y Server:** Node.js + Express
- **BD Relacional:** PostgreSQL (Sequelize) para Usuarios, Citas, Disponibilidad y Especialidades.
- **BD Documental:** MongoDB (Mongoose) para Historiales y Notificaciones.
- **Caché/Sesiones:** Redis.
- **Colas / Eventos:** RabbitMQ (Notificaciones).

## 🚀 Pasos para arrancar el entorno

1. **Requisitos Previos:**
   Asegúrate de tener corriendo en tu entorno de desarrollo local:
   - PostgreSQL (puerto `5432`) - Crear base de datos llamada `pacientes_db`.
   - Redis (puerto `6379`)
   - MongoDB (puerto `27017`)
   - RabbitMQ (puerto `5672`)

2. **Instalación de Dependencias:**
   Ejecuta el siguiente comando en la raíz del proyecto (`backGestionMedica`):
   ```bash
   npm install
   ```

3. **Ejecutar el Servidor:**
   Inicia la aplicación completa con:
   ```bash
   npm run dev
   ```
   *Esto iniciará el servidor en el puerto `3000` y conectará simultáneamente con PostgreSQL, MongoDB, Redis y RabbitMQ, creando las tablas o colas necesarias automáticamente.*

4. **Autenticación (JWT):**
   Para probar los endpoints protegidos, primero debes registrarte/loguearte en `/api/auth/login` para recibir tu token JWT. Pasa este token en los headers de tus requests con la llave `Authorization: Bearer <token>`.
