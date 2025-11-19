# Historias de Usuario - CRUD de Diagramas

**Proyecto:** BossFlow  
**Product Owner:** Alejandro Borrego Cruz  
**Fecha:** 18 de Noviembre, 2025

---

## 🎯 Objetivo

Permitir a los usuarios gestionar sus diagramas de flujo mediante operaciones CRUD.

---

## 📝 Historia #1: Crear Diagrama

**Como** usuario autenticado  
**Quiero** crear un nuevo diagrama  
**Para** representar mis procesos

### Criterios de Aceptación

- Usuario debe estar autenticado (JWT válido)
- Campos requeridos:
  - `nombre`: 3-100 caracteres, único por usuario
  - `descripción`: Opcional, máx 500 caracteres
  - `contenido`: JSON válido de React Flow
- Respuesta exitosa: `201 Created` con el diagrama creado
- Errores: `400` (datos inválidos), `401` (no autenticado), `409` (nombre duplicado)

**Endpoint:** `POST /api/diagramas`

---

## 📖 Historia #2: Listar Diagramas

**Como** usuario autenticado  
**Quiero** ver todos mis diagramas  
**Para** acceder rápidamente a ellos

### Criterios de Aceptación

- Solo muestra diagramas del usuario autenticado
- Ordenados por fecha de actualización (más recientes primero)
- Paginación: 20 por página (configurable)
- Información mostrada: nombre, descripción, fechas
- Respuesta: `200 OK` con array de diagramas
- Si no hay diagramas: array vacío

**Endpoint:** `GET /api/diagramas?page=1&limit=20`

---

## ✏️ Historia #3: Editar Diagrama

**Como** usuario autenticado  
**Quiero** editar un diagrama existente  
**Para** actualizar mis flujos

### Criterios de Aceptación

- Solo el propietario puede editar
- Campos editables: `nombre`, `descripción`, `contenido`
- Validaciones iguales que crear
- Campo `updatedAt` se actualiza automáticamente
- Respuesta: `200 OK` con diagrama actualizado
- Errores: `401` (no autenticado), `403` (no propietario), `404` (no existe)

**Endpoint:** `PUT /api/diagramas/:id`

---

## 🗑️ Historia #4: Eliminar Diagrama

**Como** usuario autenticado  
**Quiero** eliminar un diagrama  
**Para** mantener mi espacio organizado

### Criterios de Aceptación

- Solo el propietario puede eliminar
- Requiere confirmación en UI
- Eliminación permanente de BD
- Respuesta: `200 OK` o `204 No Content`
- Errores: `401` (no autenticado), `403` (no propietario), `404` (no existe)

**Endpoint:** `DELETE /api/diagramas/:id`

---

## 🔐 Seguridad

- Todas las rutas requieren autenticación JWT
- Validar ownership en editar/eliminar
- Sanitizar inputs (prevenir XSS)
- Validación de JSON en contenido