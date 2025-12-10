## Asignación de recursos y logística (criterio 3b)

### Perfiles 

Estos son los perfiles habituales que se usan en el proyecto y las responsabilidades que debe asumir cada uno.

**Desarrollador Frontend**:
	- Desarrollar componentes React, estilos y comportamiento de la UI.
	- Implementar responsive y accesibilidad básica.
	- Integrar con APIs del backend y adaptar serialización/parseo de datos.
	- Escribir y mantener tests de componentes.

**Desarrollador Backend**:
	- Diseñar y mantener APIs, la lógica de negocio y el acceso a la base de datos.
	- Implementar validaciones en el servidor.
	- Asegurar la integridad de datos, el rendimiento y la seguridad básica.
	- Escribir tests unitarios y de integración para los endpoints.

**Desarrollador Full Stack**:
	- Trabajar en tareas que requieren cambios en ambas capas (frontend y backend).
	- Coordinar contratos JSON entre cliente y servidor y validar las integraciones.
	- Desplegar cambios de las dos capas y corregir los errores que afecten a todas las capas.

**DevOps**:
	- Configurar pipelines de CI y CD con GitHub Actions y Docker para el despliegue.
	- Gestionar entornos de staging y producción, también variables y secretos.
	- Automatizar builds y la publicación de la documentación.

**QA y Testing**:
	- Definir e implementar pruebas de todo tipo: unitarias, de integración y end-to-end.
	- Garantizar la calidad final del proyecto.

**Diseñador UI/UX**:
	- Definir estilos globales, paleta de color, tipografías y la guía visual de la aplicación.
	- Diseñar la estructura de pantallas y los flujos de usuario (wireframes y prototipos).
	- Proveer assets y especificaciones (exportables) para el desarrollo.
	- Revisar accesibilidad y la experiencia general del editor y sus componentes.

**Product Owner**:
	- Priorizar el backlog, definir criterios de aceptación y validar funcionalidades.
	- Formalizar requisitos y resolver dudas funcionales del equipo.

**Scrum Master**:
	- Vigilar el equilibrio de trabajo y la capacidad del equipo durante el sprint.
	- Facilitar sesiones de Planning Poker, eliminar impedimentos y coordinar las revisiones.


### Asignaciones y estimación de esfuerzo

Cada issue tiene un responsable asignado que se han definido en el sprint planning. 

Número de horas de cada uno estimadas en cada sprint:

1. **Sprint 1**:
	- Alejandro: 20h
	- Jesús: 20h
	- Daniel: 18h

2. **Sprint 2**:
	- Alejandro: 20h
	- Jesús: 20h
	- Daniel: 20h

3. **Sprint 3**:
	- Alejandro: 18h
	- Jesús: 19h
	- Daniel: 18h

4. **Sprint 4**:
	- Alejandro: 18h
	- Jesús: 24h
	- Daniel: 20h

5. **Sprint 5**:
	- Alejandro: 10.5h
	- Jesús: 20h
	- Daniel: 17h

6. **Sprint 6**:
	- Alejandro: h
	- Jesús: h
	- Daniel: 21h


Hemos utilizado la técnica Planning Poker para estimar las horas teniendo en cuenta la cantidad de esfuerzo y complejidad que tiene cada tarea. El rango que hemos seguido con los números de Fibonacci ha sido este: 

- 1: Menos de 1 hora
- 2: Entre 1-2 horas
- 3: Entre 2-4 horas
- 5: Entre 4-8 horas
- 8: Entre 8–12 horas
- 13: Entre 12–16 horas

No hemos usado la carta 13 porque al realizar el Sprint Planning, dividos esfuerzos y complejidad entre los miembros del grupo. Esto provocó que no necesitaramos tantas horas para realizar una tarea.

### Balanceo de carga

El Scrum Master de cada Sprint ha supervisado continuamente el equilibrio de trabajo del equipo en el sprint y cuando ha sido oportuno se ha encargado de redistribuir una tarea, en subtareas entre los miembros del equipo, en caso de un miembro quedase sobrecargado de alguna tarea. Sin embargo en los Sprints planning tuvimos en cuenta esto, por lo que decidimos dividir las tareas más pequeñas para que uno no tuviera que implementar algo demasiado grande. Por ejemplo para el editor de diagramas:

- Alejandro se encargó de definir el modelo del diagrama y los endpoints del CRUD de los diagramas en el backend.
- Daniel se encargó de definir la estructura del editor e implementar el funcionamiento principal del canvas y de definir algunas funciones secundarias, aplicando los endpoints definidos.
- Jesús se encargó de hacer las funcionalidades secundarias del editor, también aplicando los endpoints definidos anteriormente.

### Recursos materiales y herramientas

- Se ha utilizado VS code como editor de código ya que es el más versátil para realizar este tipo de proyectos

- Se ha utilizado Figma para realizar los wireframes y definir la guía de estilos del proyecto.

- Se ha utilizado Git como control de versiones y GitHub para colaboración.

- Se ha utilizado Docker para crear contenedores que aíslan y despliegan el frontend, el backend y la base de datos, mediante archivos Dockerfile y docker-compose (para producción y para desarrollo).

- Para hacer pruebas a los endpoints se ha utilizado, en `backend/BossFlowHTTPRequestsInsomnia.yaml` hay colección para pruebas manuales de la API.

- Se ha utilizado una herramienta de exportación de diagramas en frontend para exportar a imagen: html-to-image.

- Para CI y CD se han implementado workflows mediante Github Actions.

- Se ha usado Nginx como reverse‑proxy y servidor estático para el frontend.

- **Servicios externos**:
	- Para mongoDB se ha utilizado mongoose, la conexión está configurada en `backend/config/database.js`.
	- Servicio de correo nodemailer configurado en `backend/services/emailService.js`.
	- Hosting: se ha utilizado un VPS desplegado con Docker Compose y Nginx.

- **Entorno de desarrollo y dependencias**:
	- Se utiliza Node.js y npm en frontend y backend.
	- Se usa Vite para desarrollo y build del frontend .
	- Se utiliza nodemon para desarrollo backend.

- **Librerías utilizadas**:
	- Frontend: react, react-dom, reactflow, axios, react-router-dom, react-toastify.
	- Backend: express, mongoose, bcrypt, jsonwebtoken, dotenv, validator, nodemailer.

- **Plugins para código**:
	- Hemos utilizado Linter `ESlint`.
	- Para formatear el código se ha utilizado Prettier.
