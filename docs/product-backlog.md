# Product Backlog - BossFlow

## 📊 Visión del Producto
BossFlow es una aplicación web que permite a los jugadores crear, compartir y gestionar diagramas de flujo interactivos con estrategias para derrotar bosses en videojuegos.

## 🎯 Objetivo
Facilitar la planificación y documentación de estrategias de combate mediante diagramas visuales intuitivos que pueden ser compartidos con la comunidad.

---

## 📝 Product Backlog Items (PBIs)

### Leyenda de Prioridades
- 🔴 **Must Have** - Crítico para el MVP (Funcionalidad básica del editor)
- 🟡 **Should Have** - Importante pero no crítico (Gestión y exportación)
- 🟢 **Could Have** - Deseable si hay tiempo (Extras y mejoras)
- ⚪ **Won't Have (this time)** - Para futuras versiones (Funcionalidades avanzadas)

### Leyenda de Estimación (Story Points)
- **1-2**: Muy simple (< 2 horas)
- **3-5**: Simple (2-4 horas)
- **8**: Medio (1 día)
- **13**: Complejo (2-3 días)
- **21**: Muy complejo (> 3 días)

---

## 🔴 MUST HAVE - Editor de Diagramas (Funcionalidad Core)

### Sprint 1: Fundación del Proyecto

| ID | Historia de Usuario | Criterios de Aceptación | Story Points | Estado |
|----|-------------------|------------------------|--------------|--------|
| US-001 | Como **desarrollador**, quiero tener el proyecto configurado (frontend + backend + DB) para poder empezar a desarrollar features | - Frontend con React funcionando<br>- Backend con Node.js + Express funcionando<br>- MongoDB conectado<br>- Comunicación entre capas verificada | 13 | ✅ En progreso |
| US-002 | Como **usuario**, quiero ver una página de inicio atractiva para entender qué es BossFlow | - Landing page con título y descripción<br>- Diseño responsive<br>- Estilos básicos aplicados | 3 | ✅ En progreso |

### Sprint 3-4: Creación/Edición de Diagramas

| ID | Historia de Usuario | Criterios de Aceptación | Story Points | Estado |
|----|-------------------|------------------------|--------------|--------|
| US-003 | Como **usuario**, quiero crear un nuevo diagrama vacío para empezar a diseñar mi estrategia | - Botón "Crear diagrama"<br>- Formulario con título y descripción<br>- Canvas vacío generado<br>- Diagrama guardado en BD | 5 | 📋 Planificado |
| US-004 | Como **usuario**, quiero mover nodos en el canvas para organizar mi diagrama | - Drag & drop de nodos<br>- Posición persistente en BD<br>- Actualización en tiempo real<br>- Sin lag visual | 5 | 📋 Planificado |
| US-005 | Como **usuario**, quiero editar el contenido de un nodo existente para modificar la estrategia | - Doble click para editar<br>- Modal/input de edición<br>- Guardar cambios en BD<br>- Feedback visual | 3 | 📋 Planificado |
| US-006 | Como **usuario**, quiero eliminar nodos que ya no necesito | - Click derecho → eliminar<br>- Tecla Delete/Backspace<br>- Confirmación de eliminación<br>- Actualización en BD | 3 | 📋 Planificado |
| US-007 | Como **usuario**, quiero eliminar diagramas completos que ya no uso | - Botón eliminar en dashboard<br>- Confirmación con modal<br>- Borrado permanente en BD<br>- No recuperable | 3 | 📋 Planificado |

### Sprint 4: Gestión de Nodos

| ID | Historia de Usuario | Criterios de Aceptación | Story Points | Estado |
|----|-------------------|------------------------|--------------|--------|
| US-008 | Como **usuario**, quiero añadir diferentes tipos de nodos (acción, decisión, inicio, fin) para representar diferentes partes de mi estrategia | - Panel de nodos disponibles<br>- Tipos: Acción, Decisión, Inicio, Fin<br>- Estilos visuales diferenciados<br>- Arrastrar al canvas | 8 | 📋 Planificado |
| US-009 | Como **usuario**, quiero configurar propiedades específicas de cada nodo para detallar la información | - Panel de propiedades por tipo<br>- Campos editables (texto, color, prioridad)<br>- Guardar propiedades en BD<br>- Preview en tiempo real | 8 | 📋 Planificado |
| US-010 | Como **usuario**, quiero añadir atributos personalizados a los nodos (etiquetas, iconos, colores) para mejor organización | - Selector de colores<br>- Librería de iconos básicos<br>- Campo de etiquetas/tags<br>- Persistencia en BD | 5 | 📋 Planificado |

### Sprint 4: Conexión de Nodos

| ID | Historia de Usuario | Criterios de Aceptación | Story Points | Estado |
|----|-------------------|------------------------|--------------|--------|
| US-011 | Como **usuario**, quiero conectar nodos con flechas para mostrar el flujo de la estrategia | - Arrastrar desde puerto de salida<br>- Conectar a puerto de entrada<br>- Flecha visible con estilo<br>- Conexión guardada en BD | 8 | 📋 Planificado |
| US-012 | Como **usuario**, quiero eliminar conexiones entre nodos cuando sea necesario | - Click en la conexión<br>- Tecla Delete<br>- Confirmación opcional<br>- Actualización en BD | 3 | 📋 Planificado |
| US-013 | Como **usuario**, quiero que las conexiones se ajusten automáticamente cuando muevo nodos | - Recalculo de posición de flecha<br>- Sin romper conexiones<br>- Actualización fluida<br>- Sin lag visual | 5 | 📋 Planificado |

---

## 🟡 SHOULD HAVE - Gestión y Funcionalidades Importantes

### Sprint 2: Autenticación y Manejo de Cuentas

| ID | Historia de Usuario | Criterios de Aceptación | Story Points | Estado |
|----|-------------------|------------------------|--------------|--------|
| US-014 | Como **usuario nuevo**, quiero registrarme con email y contraseña para crear una cuenta | - Formulario de registro funcional<br>- Validación de campos (email válido, password ≥8 chars)<br>- Usuario guardado en BD<br>- Contraseña hasheada con bcrypt | 5 | 📋 Planificado |
| US-015 | Como **usuario registrado**, quiero iniciar sesión para acceder a mis diagramas | - Formulario de login funcional<br>- Validación de credenciales<br>- JWT generado y almacenado<br>- Redirección al dashboard | 5 | 📋 Planificado |
| US-016 | Como **usuario**, quiero cerrar sesión de forma segura | - Botón de logout visible<br>- Token eliminado del localStorage<br>- Redirección a home<br>- Estado limpiado | 2 | 📋 Planificado |
| US-017 | Como **usuario**, quiero que mi sesión se mantenga activa para no tener que logearme constantemente | - JWT en localStorage<br>- Token verificado en cada request<br>- Refresh token (opcional)<br>- Sesión válida por 7 días | 5 | 📋 Planificado |

### Sprint 3: Gestión de Contenidos

| ID | Historia de Usuario | Criterios de Aceptación | Story Points | Estado |
|----|-------------------|------------------------|--------------|--------|
| US-018 | Como **usuario autenticado**, quiero ver un dashboard con todos mis diagramas para gestionarlos fácilmente | - Lista de mis diagramas<br>- Mostrar título, fecha, preview<br>- Botones editar/eliminar<br>- Paginación o scroll infinito | 8 | 📋 Planificado |
| US-019 | Como **usuario**, quiero buscar un juego en la API de Rawg.io al crear un diagrama para asociarlo correctamente | - Campo de búsqueda de juegos<br>- Resultados en tiempo real (debounce)<br>- Selección de juego<br>- Info del juego guardada (título, imagen) | 8 | 📋 Planificado |
| US-020 | Como **usuario**, quiero editar el título, descripción y juego de mis diagramas existentes | - Formulario de edición<br>- Campos pre-rellenados<br>- Cambios guardados en BD<br>- Feedback visual de éxito | 3 | 📋 Planificado |
| US-021 | Como **usuario**, quiero hacer público un diagrama para compartirlo con otros | - Toggle público/privado<br>- URL única generada<br>- Visible sin login (solo lectura)<br>- Actualización en BD | 5 | 📋 Planificado |
| US-022 | Como **visitante**, quiero ver una galería de diagramas públicos sin registrarme | - Página de galería pública<br>- Grid/lista de diagramas<br>- Info básica (título, juego, autor)<br>- Click para ver detalle | 5 | 📋 Planificado |

### Sprint 5: Exportación de Flujos

| ID | Historia de Usuario | Criterios de Aceptación | Story Points | Estado |
|----|-------------------|------------------------|--------------|--------|
| US-023 | Como **usuario**, quiero exportar mi diagrama como imagen (PNG/JPG) para compartirlo fuera de la app | - Botón "Exportar como imagen"<br>- Genera PNG del canvas<br>- Descarga automática<br>- Calidad configurable | 5 | 📋 Planificado |
| US-024 | Como **usuario**, quiero exportar mi diagrama en formato JSON para hacer backup o importarlo después | - Botón "Exportar JSON"<br>- Genera JSON del diagrama completo<br>- Descarga como archivo<br>- Estructura válida | 3 | 📋 Planificado |
| US-025 | Como **usuario**, quiero importar un diagrama desde un archivo JSON | - Botón "Importar JSON"<br>- Upload de archivo<br>- Validación de estructura<br>- Diagrama cargado en canvas<br>- Guardado en BD | 5 | 📋 Planificado |

---

## 🟢 COULD HAVE - Funcionalidades Deseables

### Comentarios en Flujos

| ID | Historia de Usuario | Criterios de Aceptación | Story Points | Estado |
|----|-------------------|------------------------|--------------|--------|
| US-026 | Como **usuario**, quiero añadir comentarios/notas a mis diagramas privados para documentar mejor | - Campo de comentarios<br>- Markdown support (opcional)<br>- Editar/eliminar comentarios<br>- Timestamp visible | 5 | 💭 Ideas |
| US-027 | Como **usuario**, quiero añadir notas flotantes en el canvas para aclaraciones rápidas | - Tipo de nodo "Nota"<br>- Posicionable libremente<br>- Color diferenciado<br>- No cuenta como nodo de flujo | 3 | 💭 Ideas |

### Colaboración

| ID | Historia de Usuario | Criterios de Aceptación | Story Points | Estado |
|----|-------------------|------------------------|--------------|--------|
| US-028 | Como **usuario registrado**, quiero clonar diagramas públicos de otros usuarios para adaptarlos a mi estrategia | - Botón "Clonar diagrama"<br>- Copia guardada en mis diagramas<br>- Editable independiente<br>- Atribución al autor original | 5 | 💭 Ideas |
| US-029 | Como **usuario**, quiero ver quién ha clonado mis diagramas públicos | - Lista de usuarios que clonaron<br>- Contador de clones<br>- Fecha de clonación<br>- Link al perfil (opcional) | 3 | 💭 Ideas |
| US-030 | Como **usuario**, quiero dar "like" a diagramas públicos que me gusten | - Botón de like<br>- Contador visible<br>- Solo 1 like por usuario<br>- Persistencia en BD | 3 | 💭 Ideas |

### Filtros por Juego

| ID | Historia de Usuario | Criterios de Aceptación | Story Points | Estado |
|----|-------------------|------------------------|--------------|--------|
| US-031 | Como **usuario**, quiero filtrar mis diagramas por juego para encontrarlos fácilmente | - Dropdown de juegos<br>- Lista filtrada en tiempo real<br>- Opción "Todos los juegos"<br>- Mantener filtro en sesión | 5 | 💭 Ideas |
| US-032 | Como **visitante**, quiero filtrar la galería pública por juego | - Barra lateral con lista de juegos<br>- Filtro aplicado instantáneamente<br>- Mostrar contador de diagramas por juego<br>- Opción "Todos" | 5 | 💭 Ideas |
| US-033 | Como **usuario**, quiero buscar diagramas por título o descripción | - Barra de búsqueda<br>- Búsqueda con debounce<br>- Resultados en tiempo real<br>- Highlight del término buscado | 5 | 💭 Ideas |

---

## ⚪ WON'T HAVE (This Time) - Futuras Versiones

### Edición Colaborativa en Tiempo Real

| ID | Funcionalidad | Razón | Story Points | Prioridad Futura |
|----|--------------|-------|--------------|------------------|
| US-034 | Colaboración en tiempo real con WebSockets | Requiere infraestructura compleja (WebSockets, gestión de conflictos, sincronización) | 21 | v2.0 |
| US-035 | Cursores de otros usuarios visibles en el canvas | Dependencia de US-034, requiere tracking en tiempo real | 13 | v2.0 |
| US-036 | Sistema de permisos (viewer, editor, owner) | Requiere lógica compleja de autorización | 8 | v2.0 |

### Chat dentro de los Diagramas

| ID | Funcionalidad | Razón | Story Points | Prioridad Futura |
|----|--------------|-------|--------------|------------------|
| US-037 | Chat en tiempo real dentro de un diagrama | Requiere WebSockets y sistema de mensajería complejo | 13 | v2.0 |
| US-038 | Notificaciones de mensajes nuevos | Dependencia de US-037 | 5 | v2.0 |
| US-039 | Historial de chat persistente | Requiere storage adicional y gestión de mensajes | 5 | v2.0 |

### Integración de Servicios Externos

| ID | Funcionalidad | Razón | Story Points | Prioridad Futura |
|----|--------------|-------|--------------|------------------|
| US-040 | Compartir diagrama en Twitter/X con preview | Requiere integración OAuth y generación de Open Graph tags | 8 | v2.0 |
| US-041 | Compartir diagrama en Discord con embed | Requiere webhook de Discord y gestión de embeds | 8 | v2.0 |
| US-042 | Integración con Twitch para streamers | Fuera del scope actual, requiere OAuth de Twitch | 13 | v3.0 |
| US-043 | Login con Google/GitHub/Discord | Requiere OAuth2 múltiple y gestión de providers | 8 | v2.0 |

### Otras Funcionalidades Avanzadas

| ID | Funcionalidad | Razón | Story Points | Prioridad Futura |
|----|--------------|-------|--------------|------------------|
| US-044 | Sistema de versiones (historial de cambios) | Requiere snapshot de estados y gestión compleja | 13 | v2.0 |
| US-045 | Aplicación móvil nativa | Fuera del scope del proyecto web | - | v3.0+ |
| US-046 | Modo offline con sync posterior | Requiere Service Workers y lógica de sincronización | 21 | v3.0 |
| US-047 | AI para sugerir estrategias basadas en datos | Fuera del alcance técnico actual | - | Investigación |

---

## 📊 Resumen de Priorización

| Categoría | Total PBIs | Story Points | Sprints Estimados |
|-----------|-----------|--------------|-------------------|
| 🔴 Must Have (Editor Core) | 13 | 76 | Sprint 1, 3, 4 |
| 🟡 Should Have (Gestión + Export) | 12 | 59 | Sprint 2, 3, 5 |
| 🟢 Could Have (Extras) | 9 | 34 | Post-MVP |
| ⚪ Won't Have (v2.0+) | 14 | 113+ | Versión 2.0+ |
| **TOTAL** | **48** | **282** | - |

---

## 🎯 Roadmap del MVP (5 Sprints)

### **Sprint 1 (04/11 - 10/11)**: Setup + Hello World
- ✅ US-001: Setup proyecto completo
- ✅ US-002: Landing page

### **Sprint 2 (11/11 - 17/11)**: Autenticación
- 🟡 US-014: Registro
- 🟡 US-015: Login
- 🟡 US-016: Logout
- 🟡 US-017: Mantener sesión

### **Sprint 3 (18/11 - 24/11)**: CRUD + Gestión de Contenidos
- 🔴 US-003: Crear diagrama
- 🟡 US-018: Dashboard
- 🟡 US-019: Búsqueda de juegos (Rawg.io)
- 🟡 US-020: Editar info del diagrama
- 🟡 US-021: Hacer público
- 🟡 US-022: Galería pública

### **Sprint 4 (25/11 - 01/12)**: Editor Funcional
- 🔴 US-004: Mover nodos
- 🔴 US-005: Editar nodos
- 🔴 US-006: Eliminar nodos
- 🔴 US-007: Eliminar diagramas
- 🔴 US-008: Tipos de nodos
- 🔴 US-009: Propiedades de nodos
- 🔴 US-010: Atributos personalizados
- 🔴 US-011: Conectar nodos
- 🔴 US-012: Eliminar conexiones
- 🔴 US-013: Ajuste automático de conexiones

### **Sprint 5 (02/12 - 08/12)**: Exportación + Deploy
- 🟡 US-023: Exportar como imagen
- 🟡 US-024: Exportar JSON
- 🟡 US-025: Importar JSON
- ⚙️ Testing completo
- ⚙️ Optimizaciones
- ⚙️ Deploy en VPS con Docker

---

## 🔄 Post-MVP (Could Have) - v1.1

Si hay tiempo después del Sprint 5:
- 🟢 US-026 a US-033: Comentarios, Colaboración básica, Filtros

---

## 📝 Criterios de Éxito del MVP

Al finalizar el Sprint 5, el usuario debe poder:

✅ **Registrarse y loguearse**  
✅ **Crear un diagrama asociado a un juego** (búsqueda en Rawg.io)  
✅ **Añadir nodos de diferentes tipos** (Acción, Decisión, Inicio, Fin)  
✅ **Editar propiedades y atributos de cada nodo**  
✅ **Conectar nodos con flechas**  
✅ **Mover nodos libremente** en el canvas  
✅ **Eliminar nodos y conexiones**  
✅ **Guardar el diagrama** automáticamente  
✅ **Ver todos sus diagramas** en un dashboard  
✅ **Hacer público un diagrama** y compartir URL  
✅ **Ver galería de diagramas públicos**  
✅ **Exportar diagrama** como imagen (PNG) o JSON  
✅ **Importar diagrama** desde JSON  

---

## 📝 Notas Importantes

- Este backlog está alineado con la **priorización MoSCoW** del documento de viabilidad técnica
- Las estimaciones son aproximadas y pueden ajustarse durante los Sprint Plannings
- El enfoque principal es el **editor de diagramas funcional** (Must Have)
- La **autenticación** y **gestión de contenidos** son secundarias pero importantes (Should Have)
- Las funcionalidades **Could Have** solo se implementarán si hay tiempo
- Las funcionalidades **Won't Have** quedan explícitamente fuera del MVP

---

**Última actualización**: 5 de noviembre de 2024  
**Mantenido por**: Jesús López Pérez (Product Owner)  
**Próxima revisión**: Sprint Planning - Sprint 2  
**Alineado con**: docs/viabilidad-tecnica.md (Método MoSCoW)