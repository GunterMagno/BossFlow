# Sprint 3 - Ceremonias Scrum

**Scrum Master**: Daniel Montes Iglesias   
**Sprint**: 15/11 - 21/11

## Daily Scrums

### 18/11/2025
- **Jesús**: Terminó sprint anterior. Hoy crea página Dashboard.
- **Daniel**: Terminó sprint anterior. Hoy instala y configura React Flow.
- **Alejandro**: Terminó sprint anterior. Hoy define criterios de aceptación CRUD y crea el modelo Diagram.

### 19/11/2025
- **Jesús**: Arregló el despliegue y creó el Dashboard. Hoy crea página Dashboard.
- **Daniel**: Instaló y configuró React Flow. Hoy implementa una página Editor con React Flow básico.
- **Alejandro**: Definió criterios de aceptación CRUD y creó el modelo Diagram. Hoy implementa endpoints para los diagramas.

### 20/11/2025
- **Jesús**: Implementó lista de diagramas y modal de creación, conectado con backend. Hoy implementa eliminación, mensajes de feedback y componente DiagramCard.
- **Daniel**: Creó página Editor básica con React Flow básico. Hoy implementa estados y documenta el componente Editor..
- **Alejandro**: Implementó algunos endpoints. Hoy terminar endpoints y testear con Insomnia.

### 21/11/2025
- **Jesús**: Implementó eliminación de diagramas, mensajes de feedback y componente DiagramCard.
- **Daniel**: Implementó estados y documentó el componente Editor con ruta desde Dashboard.
- **Alejandro**: Terminó los endpoints de los diagramas y los testeó en Insomnia.
- Documentación del scrum del sprint3
- Presentación del MVP del sprint3

---

## Impedimentos Documentados

1. **No saber implementar correctamente librerías** - Resuelto viendo documentación y tutoriales.
2. **Problemas de comunicación entre el frontend y el backend** - Resuelto revisando configuraciones y ajustando rutas en el servidor.
3. **Errores al hacer el despliegue en producción** - Resuelto revisando y configurando correctamente el despliegue.
4. **Dificultad para autenticar usuarios con JWT** - Resuelto siguiendo un flujo estándar de autenticación y verificando el middleware.

## Sprint Review

**Completado:**
- Documentación técnica del proyecto
- Mayoría de peticiones API para los diagramas completadas y funcionales.
- Persistencia de sesión.
- Página editor con diseño inicial (demo de nodos) y funcionalidad básica de nodos.
- Dashboard con apartados: inicial (estadísticas, diagramas y funcionalidades de creación) y "mis diagramas" funcionales, pudiendo crear, editar y eliminar diagramas.

---

## Retrospectiva

**Qué salió bien:**
- Buena coordinación del equipo.
- Documentación completa.
- Setup completo de backend y frontend.
- Implementación correcta de las funcionalidades backend-frontend.

**Qué mejorar:**
- Arreglar el token JWT para la sesión del usuario.
- Mejorar diseño, responsive y aplicar leyes UX.
- Modificar redirección al iniciar/crear sesión.
- Commits y PR más descriptivos.

**Acciones para Sprint 4:**
- Alejandro:
  - Optimizar Base de datos y actualizar modelos.
  - Implementar funcionalidades al backend.
  - Añadir tests para guardado/carga.
  - Documentación.
- Jesús:
  - Definir los tipos de nodos personalizados. 
  - Implementar funcionalidades al editor de diagramas.
  - Diseñar la UI de las nuevas funcionalidades.
  - Conectar con backend.
- Daniel:
  - Añadir funciones al editor de diagramas.
  - Implementar persistencia y carga de los diagramas.
  - Mejorar UX del editor.
  - Revisar código y testing.
