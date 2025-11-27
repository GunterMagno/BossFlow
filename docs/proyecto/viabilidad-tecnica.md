
# Requisitos funcionales priorizados

- Creación y edición de diagramas de flujo
- Gestión de nodos personalizados
- Exportación de flujos a otros formatos
- Gestión de los contenidos
- Gestión de cuentas
- Colaboración
- Contadores
- Poder poner comentarios en los diagramas

## Método MoSCoW (Musht, Should, Could, Won't)
- Must
    - Creación/edición de diagramas (crear, mover, editar, eliminar)
    - Gestión de nodos (tipos de nodo, propiedades, atributos)
    - Conexión de nodos
- Should
    - Gestión de contenidos
    - Exportación de flujos a otros formatos
    - Aunteticación y manejo de cuentas (registrarse y logearse)
- Could
    - Comentarios en flujos
    - Colaboración
    - Filtros por juego
- Won't
    - Edición colaborativa en tiempo real
    - Chat dentro de los diagramas
    - Integración de servicios externos (por ejepmlo, para compartir los diagramas)

# Requisitos técnicos del stack MERN

- Frontend (React):
    - React Flow
    - React Router DOM
- Backend (Node.js + Express):
    - Integraremos la API de rawg.io, si require de una auntenticación con una API key, esta API key nos da 20.000 peticiones gratuitas al mes.
- Base de datos (MongoDB): Diseñad un esquema preliminar de las colecciones principales
- Infraestructura: ¿Dónde desplegaréis? (VPS, Vercel, Render, Railway, etc.) ¿Necesitáis servicios cloud?
    - En un VPS


# Esquema de bases de datos (diagrama)

![Imagen esquema bases de datos](image-1.png)

# Arquitectura de la aplicación (diagrama)

![Imagen, arquitectura de la aplicación](image.png)

# Evaluación de las capacidades del equipo

- Haced un inventario de habilidades: ¿Quién tiene experiencia en qué?
    - Ninguno de los integrantes del equipo tiene experiencia en las tecnologías a utilizar
- Identificad lagunas de conocimiento: ¿Qué necesitaréis aprender?
    - Prácticamente todo, MongoDB, Express, React y Node
- Valorad si es realista completar el proyecto en el tiempo disponible.
    - Pensamos que realizando un buen aprendizaje de las tecnologías a utilizar y con una buena organización podemos completarlo a tiempo.


# Análisis de riesgos y mitigaciones

- Listado de 5 riesgos potenciales (técnicos, de tiempo, de recursos).
    - En cuanto a la sobrecarga de trabajo respecto con las otras asignaturas que nos pueda quitar tiempo para el buen desarrollo de la aplicación.
    - En cuanto a técnicos contamos con el desconocimiento de las tecnologías, lo cual puede llevarnos más tiempo para aprenderlas y retrasar el desarrollo.
    - Retraso por errores inesperados.
    - Problemas con la integración de la API.
    - Fallos en el despliegue de la aplicación o pérdida de datos en VPS.

- Estrategias de mitigación para cada riesgo.
    - Comenzar lo antes posible con el desarrollo para que no se acumule el trabajo.
    - Poner empeño en aprender estas tecnologías para poder realizarlo sin problemas.
    - Hacer testing de manera continua.
    - Desarrollar primero los endpoints que se utilizaran para probarlos.
    - Contenedorización con Docker para la consistencia, hacer backups.