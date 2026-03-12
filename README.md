# Backend Gestión Médica (Monolítico - PostgreSQL)

Este es el backend completo para el sistema de agendamiento de citas médicas. Originalmente concebido como microservicios, ha sido unificado en un solo proyecto monolítico que utiliza **PostgreSQL** como única base de datos para simplificar la infraestructura y el despliegue.

## Características Principales
- **Gestión de Usuarios:** Creación y validación de usuarios (Pacientes y Médicos).
- **Gestión de Especialidades y Disponibilidad:** Configuración de las especialidades médicas y los horarios disponibles de los doctores.
- **Agendamiento de Citas:** Los pacientes pueden reservar citas en horarios disponibles, y cancelarlas. Todo manejado con transacciones seguras de base de datos.
- **Historial Médico:** Creación y consulta de historiales clínicos.
- **Notificaciones:** Generación de notificaciones automáticas (ej: cuando se actualiza un historial clínico).

## Tecnologías Utilizadas
- **Node.js** con **Express**
- **PostgreSQL** (Base de datos relacional estandarizada para todo el sistema)
- **Sequelize** (ORM para interactuar con la base de datos)

## Instalación y Configuración

1. **Requisitos Previos**
   - Node.js (v16 o superior recomendado)
   - PostgreSQL (Corriendo en el puerto 5432)

2. **Configurar la Base de Datos**
   - Crea una base de datos en PostgreSQL llamada `pacientes_db`.
   - Asegúrate de tener las credenciales correctas en tu archivo `.env`.

3. **Variables de Entorno (`.env`)**
   Crea o actualiza el archivo `.env` en la raíz del proyecto:
   ```env
   PORT=3000
   DB_NAME=pacientes_db
   DB_USER=postgres
   DB_PASSWORD=admin
   DB_HOST=localhost
   DB_PORT=5432
   ```

4. **Instalar Dependencias**
   ```bash
   npm install
   ```

5. **Iniciar el Servidor**
   ```bash
   npm run dev
   ```
   > Al iniciar el servidor, Sequelize se encargará de crear y sincronizar automáticamente todas las tablas necesarias en la base de datos `pacientes_db`.

## Autenticación (Simple)
En esta versión puramente basada en PostgreSQL, la autenticación mediante JWT ha sido removida en favor de un sistema simple mediante encabezados (`Headers`) para identificar al usuario que realiza la petición.

Para las rutas protegidas, debes enviar el ID del usuario en el header `X-User-Id`.

1. Realiza un POST a `/api/auth/login` con tus credenciales.
2. La respuesta te devolverá el ID del usuario en el campo `"X-User-Id"`.
3. Para todas las peticiones subsecuentes a endpoints requeridos, añade este header: `X-User-Id: <id_del_usuario>`.
