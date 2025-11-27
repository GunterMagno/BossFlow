# 📚 Documentación de BossFlow

Índice organizado de toda la documentación del proyecto.

---

## 📋 Proyecto Académico

Documentos principales del proyecto para la asignatura.

- [Problema y Justificación](proyecto/problema.md)
- [Viabilidad Técnica](proyecto/viabilidad-tecnica.md)
- [Objetivos y Alcance](proyecto/objetivos-alcance.md)
- [Recursos del Proyecto](proyecto/recursos.md)

---

## 🏗️ Arquitectura

Diseño técnico del sistema.

- [Base de Datos - Diseño](arquitectura/base-de-datos.md)
- [Diagrama ER](arquitectura/diagrama-er.png)
- [Flujo de Autenticación](arquitectura/auth-flujo.md)
- [Estrategia de Logout](arquitectura/estrategia-logout.md)

---

## 🔌 API

Documentación de la API REST y estructura de datos.

- [Estructura JSON de Nodos - Schema Técnico](api/estructura-nodos-json.md)
- [Tipos de Nodos Personalizados](api/NODE_TYPES.md)

### Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Login y generación de JWT |
| POST | `/api/auth/logout` | Invalidar token |
| GET | `/api/diagrams` | Listar diagramas del usuario |
| POST | `/api/diagrams` | Crear nuevo diagrama |
| GET | `/api/diagrams/:id` | Obtener diagrama específico |
| PUT | `/api/diagrams/:id` | Actualizar diagrama |
| DELETE | `/api/diagrams/:id` | Eliminar diagrama |

---

## 🚀 Despliegue

Guías de configuración y deployment.

- [Setup Docker](despliegue/setup-docker.md)
- [Despliegue en VPS](despliegue/despliegue-vps.md)
- [Guía de Despliegue General](despliegue/DESPLIEGUE.md)

---

## 🎨 UI/UX

Diseño de interfaz y experiencia de usuario.

- [Diseño en Figma](ui-ux/figma.md)
- [Capturas de Pantalla](ui-ux/capturas/)

---

## 🏃 Sprints

Documentación de la metodología ágil SCRUM.

- [Product Backlog](sprints/product-backlog.md)

### Sprint 1
- [Ceremonias](sprints/sprint1/ceremonias.md)

### Sprint 2
- [Ceremonias](sprints/sprint2/ceremonias.md)
- [Implementación](sprints/sprint2/implementacion.md)

### Sprint 3
- [Backlog](sprints/sprint3/backlog.md)
- [Ceremonias](sprints/sprint3/ceremonias.md)

---

## 📝 Historias de Usuario

User Stories del proyecto.

- [CRUD de Diagramas](historias-usuario/crud-diagramas.md)

---

## 🔗 Enlaces Externos

- [Repositorio GitHub](https://github.com/GunterMagno/BossFlow)
- [React Flow Docs](https://reactflow.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)

---

**Última actualización**: 2025-11-27  
**Equipo**: Alejandro Borrego, Jesús López, Daniel Montes
