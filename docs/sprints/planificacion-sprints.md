# Planificación de Sprints - BossFlow

## Introducción

Este documento detalla la planificación del proyecto BossFlow organizado en 6 sprints de 1 semana cada uno. El proyecto cuenta con un equipo de 3 desarrolladores.

---

## Resumen de Sprints

| Sprint | Fechas | Objetivo | Entregables Esperados |
|--------|--------|----------|----------------------|
| **Sprint 1** | 31 Oct - 6 Nov 2024 | Setup y Arquitectura Base | Repositorio configurado, estructura MERN inicial, conexión backend-frontend, base de datos operativa, documentación de setup |
| **Sprint 2** | 7 Nov - 13 Nov 2024 | Autenticación y Gestión de Usuarios | Sistema de autenticación JWT completo, registro y login funcionales, rutas protegidas, wireframes y sistema de diseño |
| **Sprint 3** | 14 Nov - 20 Nov 2024 | CRUD de Diagramas | CRUD completo de diagramas, dashboard de usuario, integración React Flow, navegación editor-dashboard |
| **Sprint 4** | 21 Nov - 27 Nov 2024 | Editor Visual y Funcionalidades Avanzadas | Editor visual completo con nodos personalizados, drag & drop, conexiones entre nodos, guardado/carga de diagramas |
| **Sprint 5** | 28 Nov - 4 Dic 2024 | Funcionalidades Avanzadas y Testing | Soporte de imágenes, sistema de plantillas, exportación/importación (JSON, PDF, PNG), testing exhaustivo, despliegue en producción |
| **Sprint 6** | 5 Dic - 12 Dic 2024 | Documentación y Cierre del Proyecto | Documentación técnica completa, video demo, presentación final, README actualizado, retrospectiva del proyecto |

---

## SPRINT 1: Setup y Arquitectura Base

**Duración:** Semana 1  
**Estimación Total:** 43 horas  
**Issues:** 20

### Objetivo del Sprint

Establecer la base técnica del proyecto configurando el repositorio, las herramientas de desarrollo, y la estructura inicial tanto del backend (Node.js + Express + MongoDB) como del frontend (React + Vite). Configurar la infraestructura completa incluyendo estructura de carpetas, dependencias, base de datos y entorno de desarrollo. El equipo también debe familiarizarse con las tecnologías clave del stack MERN y establecer los flujos de trabajo colaborativo con Git/GitHub.

### Issues

| # | Tarea | Responsable (Rol) | Estimación (h) | Prioridad |
|---|-------|------------------|----------------|-----------|
| #1 | Aprender fundamentos de Node.js | Alejandro Borrego (Backend Dev) | 5 | 1 |
| #2 | Aprender Express.js básico | Alejandro Borrego (Backend Dev) | 4 | 2 |
| #3 | Setup proyecto Backend | Alejandro Borrego (Backend Dev) | 3 | 3 |
| #4 | Crear ruta GET /api/health | Alejandro Borrego (Backend Dev) | 2 | 4 |
| #5 | Configurar MongoDB local | Alejandro Borrego (Scrum Master) | 3 | 5 |
| #6 | Facilitar Daily Scrums | Alejandro Borrego (Scrum Master) | 2 | 6 |
| #7 | Documentar setup Backend | Alejandro Borrego (Scrum Master) | 1 | 7 |
| #8 | Aprender fundamentos de React | Jesús López Pérez (Product Owner) | 6 | 1 |
| #9 | Aprender React Hooks | Jesús López Pérez (Product Owner) | 3 | 2 |
| #10 | Setup proyecto Frontend | Jesús López Pérez (Product Owner) | 3 | 3 |
| #11 | Crear componente Home básico | Jesús López Pérez (Product Owner) | 2 | 4 |
| #12 | Conectar Frontend con Backend | Jesús López Pérez (Product Owner) | 3 | 5 |
| #13 | Crear Product Backlog inicial | Jesús López Pérez (Product Owner) | 2 | 6 |
| #14 | Documentar setup Frontend | Jesús López Pérez (Product Owner) | 1 | 7 |
| #15 | Aprender Git/GitHub workflow | Daniel Montes (Developer) | 2 | 1 |
| #16 | Configurar repositorio GitHub | Daniel Montes (Developer) | 2 | 2 |
| #17 | Aprender MongoDB + Mongoose | Daniel Montes (Developer) | 5 | 3 |
| #18 | Investigar API Rawg.io | Daniel Montes (Developer) | 3 | 4 |
| #19 | Diseñar esquema DB inicial | Daniel Montes (Developer) | 3 | 5 |
| #20 | Setup entorno de desarrollo | Daniel Montes (Developer) | 3 | 6 |

---

## SPRINT 2: Autenticación y Gestión de Usuarios

**Duración:** Semana 2  
**Estimación Total:** 55 horas  
**Issues:** 21

### Objetivo del Sprint

Implementar un sistema de autenticación completo y seguro utilizando JWT que permita a los usuarios registrarse, iniciar sesión y mantener su sesión activa. Desarrollar el sistema completo de autenticación con registro, login y protección de rutas. Tanto el backend como el frontend deben proteger las rutas que requieren autenticación, y se debe diseñar la interfaz de usuario básica con wireframes y un sistema de diseño coherente para las siguientes fases del proyecto.

### Issues

| # | Tarea | Responsable (Rol) | Estimación (h) | Prioridad |
|---|-------|------------------|----------------|-----------|
| #21 | Crear modelo User en MongoDB | Alejandro Borrego (Backend Dev) | 3 | 1 |
| #22 | Implementar registro de usuarios | Alejandro Borrego (Backend Dev) | 4 | 2 |
| #23 | Implementar login de usuarios | Alejandro Borrego (Backend Dev) | 4 | 3 |
| #24 | Crear middleware de autenticación | Alejandro Borrego (Backend Dev) | 3 | 4 |
| #25 | Implementar logout | Alejandro Borrego (Backend Dev) | 2 | 5 |
| #26 | Testing con Insomnia | Alejandro Borrego (Backend Dev) | 3 | 6 |
| #27 | Code review | Alejandro Borrego (Backend Dev) | 1 | 7 |
| #28 | Crear componente de Login | Jesús López Pérez (Frontend Lead) | 4 | 1 |
| #29 | Crear componente de Registro | Jesús López Pérez (Frontend Lead) | 4 | 2 |
| #30 | Implementar Context API para Auth | Jesús López Pérez (Frontend Lead) | 4 | 3 |
| #31 | Conectar Login/Registro con Backend | Jesús López Pérez (Frontend Lead) | 3 | 4 |
| #32 | Guardar JWT en localStorage | Jesús López Pérez (Frontend Lead) | 2 | 5 |
| #33 | Facilitar ceremonias SCRUM | Jesús López Pérez (Scrum Master) | 2 | 6 |
| #34 | Documentar flujo de autenticación | Jesús López Pérez (Scrum Master) | 1 | 7 |
| #35 | Diseñar wireframes básicos | Daniel Montes (UI/UX) | 4 | 1 |
| #36 | Crear sistema de diseño | Daniel Montes (UI/UX) | 3 | 2 |
| #37 | Implementar navbar básico | Daniel Montes (Frontend Dev) | 3 | 3 |
| #38 | Crear layout principal | Daniel Montes (Frontend Dev) | 3 | 4 |
| #39 | Implementar rutas protegidas | Daniel Montes (Frontend Dev) | 3 | 5 |
| #40 | Refinar historias Sprint 3 | Daniel Montes (Product Owner) | 2 | 6 |
| #41 | Validar MVP Sprint 2 | Daniel Montes (Product Owner) | 2 | 7 |

---

## SPRINT 3: CRUD de Diagramas

**Duración:** Semana 3  
**Estimación Total:** 60 horas  
**Issues:** 21

### Objetivo del Sprint

Desarrollar la funcionalidad central del proyecto implementando el CRUD completo de diagramas, permitiendo a los usuarios crear, listar, visualizar y eliminar sus diagramas desde un dashboard. Implementar las operaciones de crear, leer, actualizar y eliminar diagramas con su dashboard correspondiente. Se integra React Flow como base del editor visual y se establecen las rutas y componentes necesarios para la navegación entre el dashboard y el editor de diagramas.

### Issues

| # | Tarea | Responsable (Rol) | Estimación (h) | Prioridad |
|---|-------|------------------|----------------|-----------|
| #42 | Definir criterios de aceptación CRUD | Alejandro Borrego (Product Owner) | 2 | 1 |
| #43 | Crear modelo Diagram | Alejandro Borrego (Backend Dev) | 3 | 2 |
| #44 | Implementar POST /api/diagrams | Alejandro Borrego (Backend Dev) | 3 | 3 |
| #45 | Implementar GET /api/diagrams | Alejandro Borrego (Backend Dev) | 3 | 4 |
| #46 | Implementar DELETE /api/diagrams/:id | Alejandro Borrego (Backend Dev) | 3 | 5 |
| #47 | Implementar GET /api/diagrams/:id | Alejandro Borrego (Backend Dev) | 2 | 6 |
| #48 | Testing endpoints con Insomnia | Alejandro Borrego (Backend Dev) | 2 | 7 |
| #49 | Crear página Dashboard | Jesús López Pérez (Frontend Lead) | 2 | 1 |
| #50 | Implementar listado de diagramas | Jesús López Pérez (Frontend Lead) | 4 | 2 |
| #51 | Crear modal para nuevo diagrama | Jesús López Pérez (Frontend Lead) | 3 | 3 |
| #52 | Conectar creación con backend | Jesús López Pérez (Frontend Lead) | 3 | 4 |
| #53 | Implementar eliminación de diagramas | Jesús López Pérez (Frontend Lead) | 3 | 5 |
| #54 | Añadir mensajes de feedback | Jesús López Pérez (Frontend Lead) | 2 | 6 |
| #55 | Crear componente DiagramCard | Jesús López Pérez (Frontend Lead) | 2 | 7 |
| #56 | Instalar y configurar React Flow | Daniel Montes (Frontend Dev) | 2 | 1 |
| #57 | Crear página Editor básica | Daniel Montes (Frontend Dev) | 3 | 2 |
| #58 | Implementar React Flow básico | Daniel Montes (Frontend Dev) | 4 | 3 |
| #59 | Crear ruta desde Dashboard a Editor | Daniel Montes (Frontend Dev) | 2 | 4 |
| #60 | Implementar estado inicial vacío | Daniel Montes (Frontend Dev) | 2 | 5 |
| #61 | Organizar Daily Scrums | Daniel Montes (Scrum Master) | 3 | 6 |
| #62 | Documentar componente Editor | Daniel Montes (Scrum Master) | 2 | 7 |

---

## SPRINT 4: Editor Visual y Funcionalidades Avanzadas

**Duración:** Semana 4  
**Estimación Total:** 67 horas  
**Issues:** 21

### Objetivo del Sprint

Implementar el editor visual completo con React Flow incluyendo nodos personalizados, conexiones, drag & drop, guardado y carga. Desarrollar nodos personalizados para diferentes tipos de elementos (bases, cuarteles, recursos, etc.), permitir la creación de conexiones entre nodos, implementar la funcionalidad de guardado y carga de diagramas desde el servidor, y añadir capacidades de drag & drop para una experiencia de usuario fluida.

### Issues

| # | Tarea | Responsable (Rol) | Estimación (h) | Prioridad |
|---|-------|------------------|----------------|-----------|
| #63 | Actualizar modelo Diagram con nodes | Alejandro Borrego (Backend Dev) | 2 | 1 |
| #64 | Implementar PUT /api/diagrams/:id | Alejandro Borrego (Backend Dev) | 3 | 2 |
| #65 | Optimizar queries MongoDB | Alejandro Borrego (Backend Dev) | 3 | 3 |
| #66 | Implementar validaciones backend | Alejandro Borrego (Backend Dev) | 3 | 4 |
| #67 | Añadir timestamps | Alejandro Borrego (Backend Dev) | 2 | 5 |
| #68 | Testing de guardado/carga | Alejandro Borrego (Backend Dev) | 3 | 6 |
| #69 | Documentar estructura de datos | Alejandro Borrego (Backend Dev) | 2 | 7 |
| #70 | Definir tipos de nodos | Jesús López Pérez (Product Owner) | 4 | 1 |
| #71 | Implementar panel lateral | Jesús López Pérez (Frontend Lead) | 3 | 2 |
| #72 | Implementar drag & drop de nodos | Jesús López Pérez (Frontend Lead) | 4 | 3 |
| #73 | Crear modal de edición de nodos | Jesús López Pérez (Frontend Lead) | 4 | 4 |
| #74 | Implementar eliminación de nodos | Jesús López Pérez (Frontend Lead) | 2 | 5 |
| #75 | Añadir toolbar al editor | Jesús López Pérez (Frontend Lead) | 3 | 6 |
| #76 | Conectar guardado con backend | Jesús López Pérez (Frontend Lead) | 4 | 7 |
| #77 | Implementar conexión de nodos | Daniel Montes (Frontend Dev) | 4 | 1 |
| #78 | Crear custom nodes personalizados | Daniel Montes (Frontend Dev) | 5 | 2 |
| #79 | Implementar guardado en backend | Daniel Montes (Frontend Dev) | 3 | 3 |
| #80 | Implementar carga de diagrama | Daniel Montes (Frontend Dev) | 4 | 4 |
| #81 | Mejorar UI del editor | Daniel Montes (Frontend Dev) | 2 | 5 |
| #82 | Mejorar UX del editor | Daniel Montes (Frontend Dev) | 1 | 6 |
| #83 | Code review y testing | Daniel Montes (QA Lead) | 1 | 7 |

---

## SPRINT 5: Funcionalidades Avanzadas y Testing

**Duración:** Semana 5  
**Estimación Total:** 68 horas  
**Issues:** 19

### Objetivo del Sprint

Enriquecer la aplicación con funcionalidades avanzadas como soporte para imágenes en nodos, sistema de plantillas predefinidas, capacidades de exportación e importación en múltiples formatos (JSON, PDF, PNG), y realizar testing exhaustivo del MVP. Agregar características avanzadas incluyendo soporte de imágenes, templates, exportación/importación, testing exhaustivo y despliegue. Adicionalmente, se despliega el frontend en producción y se preparan las ceremonias finales y documentación de usuario para asegurar que el proyecto esté listo para la fase de cierre.

### Issues

| # | Tarea | Responsable (Rol) | Estimación (h) | Prioridad |
|---|-------|------------------|----------------|-----------|
| #84 | Backend: actualizar modelo para imágenes | Alejandro Borrego (Backend Dev) | 3 | 1 |
| #85 | Frontend: UI para gestión de imágenes | Alejandro Borrego (Frontend Dev) | 3 | 3 |
| #88 | Frontend: popup con descripción en nodo | Alejandro Borrego (Frontend Dev) | 1.5 | 5 |
| #89 | Frontend: popup/hover de descripción (UX) | Alejandro Borrego (Frontend Dev) | 1 | 6 |
| #90 | Build de producción Frontend | Jesús López Pérez (Frontend Lead) | 2 | 1 |
| #91 | Desplegar Frontend | Jesús López Pérez (Frontend Lead) | 2 | 2 |
| #92 | Testing completo del MVP | Jesús López Pérez (QA Lead) | 4 | 3 |
| #93 | Crear presentación final | Jesús López Pérez (Documentation) | 5 | 4 |
| #94 | Documentación de usuario | Jesús López Pérez (Documentation) | 3 | 5 |
| #95 | Testing de aceptación final | Jesús López Pérez (QA Lead) | 2 | 6 |
| #96 | Facilitar ceremonias finales | Jesús López Pérez (Scrum Master) | 2 | 7 |
| #181 | Crear página Plantillas | Daniel Montes (Frontend Dev) | 4 | 1 |
| #182 | Implementar plantillas de diagramas | Daniel Montes (Product Owner) | 3 | 1 |
| #184 | Implementar exportación de diagramas | Daniel Montes (Product Owner) | 4 | 3 |
| #185 | Implementar importación/exportación JSON | Daniel Montes (Product Owner) | 4 | 4 |
| #189 | Arreglar e implementar funcionalidades | Daniel Montes (Product Owner) | 2 | 5 |
| #86 | Backend: endpoints para subida de imágenes | Alejandro Borrego (Backend Dev) | 2 | 2 |
| #87 | Frontend: renderizado de imágenes en editor | Alejandro Borrego (Frontend Dev) | 2 | 4 |
| #177 | Tests y documentación: imágenes | Alejandro Borrego (Backend Dev) | 1.5 | 7 |

---

## SPRINT 6: Documentación y Cierre del Proyecto

**Duración:** Semana 6  
**Estimación Total:** 31 horas  
**Issues:** 10

### Objetivo del Sprint

Cerrar el proyecto completando toda la documentación técnica y de usuario necesaria para la entrega final. Completar la documentación final, video demo, presentación y entrega del proyecto. Esto incluye la documentación de la Fase 3, la creación de un video demostrativo, la actualización del README principal, la documentación de arquitectura técnica, y la preparación de la presentación final. Se corrigen los últimos bugs críticos y se realiza la retrospectiva final del proyecto para identificar lecciones aprendidas y áreas de mejora.

### Issues

| # | Tarea | Responsable (Rol) | Estimación (h) | Prioridad |
|---|-------|------------------|----------------|-----------|
| #97 | Documentar Fase 3 del proyecto | Daniel Montes (Documentation Lead) | 8 | 1 |
| #98 | Corregir bugs críticos finales | Daniel Montes (QA Lead) | 2 | 2 |
| #99 | Crear video demo | Daniel Montes (Documentation Lead) | 3 | 3 |
| #100 | Actualizar README principal | Daniel Montes (Documentation Lead) | 2 | 4 |
| #101 | Documentar arquitectura técnica | Daniel Montes (Documentation Lead) | 2 | 5 |
| #102 | Retrospectiva final del proyecto | Daniel Montes (Scrum Master) | 2 | 6 |
| #103 | Preparar entrega final | Daniel Montes (Product Owner) | 2 | 7 |
| - | Trabajar en documentación | Jesús López Pérez (Documentation) | 4 | 1 |
| - | Trabajar en documentación | Alejandro Borrego (Documentation) | 4 | 1 |
| - | Trabajar en documentación | Daniel Montes (Documentation Lead) | 4 | 8 |

---

