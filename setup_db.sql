-- ==========================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS (MySQL)
-- ==========================================

-- Deshabilitar la comprobación de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar tablas si existen para reiniciar limpiamente (Opcional, usar con cuidado en producción)
DROP TABLE IF EXISTS `notificaciones`;
DROP TABLE IF EXISTS `citas`;
DROP TABLE IF EXISTS `disponibilidades`;
DROP TABLE IF EXISTS `historial_medico`;
DROP TABLE IF EXISTS `especialidades`;
DROP TABLE IF EXISTS `usuarios`;

-- Restaurar la comprobación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;


-- ==========================================
-- CREACIÓN DE TABLAS
-- ==========================================

-- Tabla Usuarios
CREATE TABLE `usuarios` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `rol` ENUM('paciente', 'medico', 'admin') DEFAULT 'paciente',
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla Especialidades (si aplica)
CREATE TABLE `especialidades` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(255) NOT NULL,
    `descripcion` TEXT,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla Disponibilidades (Para médicos)
CREATE TABLE `disponibilidades` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `medicoId` INT NOT NULL,
    `fecha` DATE NOT NULL,
    `horaInicio` TIME NOT NULL,
    `horaFin` TIME NOT NULL,
    `estado` VARCHAR(50) DEFAULT 'disponible',
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`medicoId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
);

-- Tabla Citas
CREATE TABLE `citas` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `pacienteId` INT NOT NULL,
    `medicoId` INT NOT NULL,
    `fecha` DATE NOT NULL,
    `hora` TIME NOT NULL,
    `estado` ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
    `motivo` TEXT,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`pacienteId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`medicoId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
);


-- Tabla Notificaciones
CREATE TABLE `notificaciones` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `usuarioId` INT NOT NULL,
    `mensaje` VARCHAR(255) NOT NULL,
    `tipo` VARCHAR(50) DEFAULT 'push',
    `leida` BOOLEAN DEFAULT false,
    `fecha` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
);

-- Tabla Historial Médico (si aplica al sistema)
CREATE TABLE `historial_medico` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `pacienteId` INT NOT NULL,
    `medicoId` INT NOT NULL,
    `diagnostico` TEXT NOT NULL,
    `tratamiento` TEXT,
    `fecha` DATE DEFAULT (CURRENT_DATE),
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`pacienteId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`medicoId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
);


-- ==========================================
-- DATOS DE PRUEBA (MOCK DATA)
-- ==========================================
-- Nota: La contraseña para todos es 'password123'
-- Hasheada con bcrypt (cost factor: 10)
-- password123 = $2a$10$tZ2yNf.fL5K0v1M1Q0L9IukB8oR7oD7O11M81M4c.GzXo2oN8.s7e

INSERT INTO `usuarios` (`nombre`, `email`, `password`, `rol`, `createdAt`, `updatedAt`) VALUES
('Admin Sistema', 'admin@admin.com', '$2a$10$tZ2yNf.fL5K0v1M1Q0L9IukB8oR7oD7O11M81M4c.GzXo2oN8.s7e', 'admin', NOW(), NOW()),
('Dr. Juan Perez', 'juan.perez@medico.com', '$2a$10$tZ2yNf.fL5K0v1M1Q0L9IukB8oR7oD7O11M81M4c.GzXo2oN8.s7e', 'medico', NOW(), NOW()),
('Dra. Maria Gomez', 'maria.gomez@medico.com', '$2a$10$tZ2yNf.fL5K0v1M1Q0L9IukB8oR7oD7O11M81M4c.GzXo2oN8.s7e', 'medico', NOW(), NOW()),
('Carlos Lopez', 'carlos.lopez@paciente.com', '$2a$10$tZ2yNf.fL5K0v1M1Q0L9IukB8oR7oD7O11M81M4c.GzXo2oN8.s7e', 'paciente', NOW(), NOW()),
('Ana Martinez', 'ana.martinez@paciente.com', '$2a$10$tZ2yNf.fL5K0v1M1Q0L9IukB8oR7oD7O11M81M4c.GzXo2oN8.s7e', 'paciente', NOW(), NOW());

-- Insertar Especialidades (Opcional, si modelaste las relaciones Many-to-Many con Médicos, ajustarías aquí)
INSERT INTO `especialidades` (`nombre`, `descripcion`, `createdAt`, `updatedAt`) VALUES
('Cardiología', 'Especialidad médica que se ocupa de las afecciones del corazón', NOW(), NOW()),
('Pediatría', 'Rama de la medicina que involucra la atención médica de bebés, niños y adolescentes', NOW(), NOW());

-- Insertar Disponibilidad (Para Dr. Juan Perez ID: 2)
INSERT INTO `disponibilidades` (`medicoId`, `fecha`, `horaInicio`, `horaFin`, `estado`, `createdAt`, `updatedAt`) VALUES
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '08:00:00', '12:00:00', 'disponible', NOW(), NOW()),
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', '18:00:00', 'disponible', NOW(), NOW());

-- Insertar Citas Prueba (Paciente Carlor ID: 4, Medico Juan Perez ID: 2)
INSERT INTO `citas` (`pacienteId`, `medicoId`, `fecha`, `hora`, `estado`, `motivo`, `createdAt`, `updatedAt`) VALUES
(4, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00:00', 'pendiente', 'Revisión general', NOW(), NOW());

-- Insertar Notificación Prueba (Para Paciente Carlos ID: 4)
INSERT INTO `notificaciones` (`usuarioId`, `mensaje`, `tipo`, `leida`, `fecha`, `createdAt`, `updatedAt`) VALUES
(4, 'Tu cita con Dr. Juan Perez está pendiente de confirmación', 'push', false, NOW(), NOW(), NOW());
