# Legislación pplicable a la aplicación BossFlow

Este documento resume las normativas aplicables al proyecto BossFlow, los requisitos específicos de cada una, el plan de implementación técnica y enlaces a las políticas legales desarrolladas.

## Índice

1. [Normativas aplicables](#normativas-aplicables)
2. [Requisitos específicos por normativa](#requisitos-específicos-por-normativa)
3. [Plan de implementación técnica](#plan-de-implementación-técnica)
4. [Políticas legales](#políticas-legales)
5. [Estado de cumplimiento](#estado-de-cumplimiento)
6. [Documentación adicional](#documentación-adicional)

## Normativas aplicables

### 1. Reglamento general de protección de datos (RGPD)

Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos.

Es aplicable a BossFlow porque la aplicación recoge y procesa datos personales de usuarios que pueden residir en la Unión Europea. Los datos tratados incluyen información de identificación (nombre de usuario, email), datos de autenticación (contraseña cifrada), datos de perfil (avatar, bio, favoriteGames) y contenido generado por el usuario (diagramas de flujo, imágenes subidas). Al ofrecer el servicio a usuarios europeos, BossFlow debe cumplir con todas las obligaciones establecidas en el RGPD.

Enlace: [https://eur-lex.europa.eu/eli/reg/2016/679/oj](https://eur-lex.europa.eu/eli/reg/2016/679/oj)

### 2. Directiva ePrivacy (cookies)

Directiva 2002/58/CE sobre la privacidad y las comunicaciones electrónicas, modificada por la Directiva 2009/136/CE.

Es aplicable a BossFlow porque aunque la aplicación no utiliza cookies, sí carga recursos externos desde servidores de terceros. Específicamente, se cargan fuentes tipográficas desde Google Fonts (fonts.googleapis.com), lo que implica que el navegador del usuario establece comunicación con servidores de Google y transmite datos como la dirección IP, User-Agent y referer. Esta normativa requiere informar a los usuarios sobre estas comunicaciones con terceros y sus implicaciones en la privacidad.

Enlace: [https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32002L0058](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32002L0058)

### 3. Ley de servicios de la sociedad de la información (LSSI-CE)

Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico.

Es aplicable a BossFlow porque se trata de un servicio que opera a través de internet y ofrece funcionalidad a usuarios en España y la Unión Europea. La aplicación permite el registro de usuarios, la creación y almacenamiento de contenido (diagramas de flujo), y la subida de imágenes, lo que la clasifica como un servicio en línea sujeto a esta normativa. La LSSI-CE establece obligaciones sobre información legal, identificación del prestador, transparencia del servicio y procedimientos de moderación de contenido.

Enlace: [https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758)

### 4. Real decreto 1112/2018 sobre accesibilidad

Real Decreto 1112/2018, de 7 de septiembre, sobre accesibilidad de los sitios web y aplicaciones para dispositivos móviles del sector público.

Establece estándares de accesibilidad web que benefician a todos los usuarios, especialmente a personas con discapacidades. Adoptar el nivel AA de WCAG 2.1 (referenciado por este decreto) amplía la audiencia potencial de la aplicación, mejora la experiencia de uso y demuestra compromiso con la inclusión digital. Además, si la aplicación es utilizada por entidades educativas o públicas, cumplir con estos estándares facilitará su adopción.

Enlace: [https://www.boe.es/eli/es/rd/2018/09/21/1112](https://www.boe.es/eli/es/rd/2018/09/21/1112)

### 5. Norma UNE-EN 301549

Estándar europeo de requisitos de accesibilidad para productos y servicios TIC (Tecnologías de la Información y la Comunicación).

Es aplicable a BossFlow como marco de referencia técnico porque establece los requisitos específicos de accesibilidad que deben cumplir los productos y servicios de tecnologías de la información y comunicación en el ámbito europeo. Esta norma armonizada proporciona especificaciones técnicas detalladas sobre cómo implementar la accesibilidad en sitios web, aplicaciones móviles, documentos electrónicos y otros productos TIC. Incorpora por referencia las Pautas de Accesibilidad para el Contenido Web (WCAG 2.1) del W3C, estableciendo criterios concretos y verificables que BossFlow puede seguir para garantizar que la aplicación sea utilizable por personas con diferentes capacidades funcionales, incluyendo usuarios con discapacidades visuales, auditivas, motoras o cognitivas. Seguir este estándar asegura la compatibilidad con tecnologías de asistencia como lectores de pantalla, magnificadores de pantalla, sistemas de reconocimiento de voz y dispositivos de entrada alternativos.

Enlace: [https://www.en301549.eu/](https://www.en301549.eu/)

### 6. Licencias de software de código abierto

BossFlow utiliza bibliotecas y recursos con licencias MIT, Creative Commons y SIL Open Font License.

Es aplicable a BossFlow porque el proyecto utiliza múltiples bibliotecas de código abierto y recursos de terceros que están sujetos a términos de licencia específicos. El frontend utiliza bibliotecas como React, Vite, React Router y react-icons (licencia MIT), mientras que el backend usa Express, Mongoose y bcrypt (también MIT). Además, se utilizan iconos de Font Awesome (Creative Commons Attribution 4.0) y fuentes de Google Fonts (SIL Open Font License). Cada una de estas licencias establece obligaciones de atribución, uso y redistribución que BossFlow debe respetar para evitar infracciones de propiedad intelectual.

## Requisitos específicos por normativa

### RGPD - requisitos clave

1. Consentimiento explícito del usuario
   - Casilla de aceptación en registro (no pre-marcada)
   - Registro de timestamp del consentimiento en base de datos

2. Información transparente
   - Política de Privacidad clara y accesible
   - Información sobre datos recogidos, finalidades, destinatarios, derechos del usuario

3. Derechos de los usuarios
   - Acceso: Obtener copia de sus datos personales
   - Rectificación: Corregir datos inexactos
   - Supresión: Derecho al olvido
   - Portabilidad: Obtener datos en formato JSON
   - Oposición: Oponerse al tratamiento
   - Limitación: Restringir el tratamiento en ciertos casos

4. Seguridad de los datos
   - Cifrado de contraseñas (bcrypt)
   - Autenticación segura (JWT)
   - HTTPS en producción
   - CORS restrictivo
   - Validación y sanitización de inputs
   - Rate limiting para prevenir ataques de fuerza bruta

5. Notificación de brechas
   - Notificar a AEPD en máximo 72 horas
   - Comunicar a usuarios afectados si hay alto riesgo

6. Plazo de conservación
   - Definir plazos claros para cada tipo de dato
   - Implementar eliminación automática tras expiración

7. Registro de actividades de tratamiento
   - Mantener documentación actualizada de tratamientos

### ePrivacy - requisitos clave

1. Información sobre recursos externos
   - Informar sobre Google Fonts en Política de Privacidad
   - Explicar implicaciones de carga de recursos de terceros

2. Alternativas de mayor privacidad
   - Evaluar self-hosting de fuentes para evitar contacto con servidores externos

### LSSI-CE - requisitos clave

1. Información legal accesible
   - Términos de Uso publicados y accesibles
   - Política de Privacidad publicada y accesible

2. Identificación del prestador
   - Información de contacto: bosslflow1@gmail.com

3. Información sobre el servicio
   - Descripción clara de funcionalidad y limitaciones

4. Moderación de contenido
   - Procedimiento de notificación de contenido inapropiado
   - Política de eliminación de contenido ilícito

### WCAG 2.1 - requisitos clave (nivel AA)

1. Contraste de colores
   - Ratio mínimo 4.5:1 para texto normal
   - Ratio mínimo 3:1 para texto grande y componentes UI

2. Navegación por teclado
   - Todos los elementos interactivos accesibles por teclado
   - Indicadores visuales de foco consistentes
   - Trap focus en modales

3. Alternativas textuales
   - Atributos alt en todas las imágenes
   - aria-hidden en iconos decorativos

4. Estructura semántica
   - Uso de HTML5 semántico
   - Jerarquía de encabezados clara
   - Atributos ARIA apropiados

5. Compatibilidad con lectores de pantalla
   - Etiquetas en formularios
   - Anuncios de errores y notificaciones
   - Textos descriptivos en enlaces

### Licencias de software

1. Bibliotecas MIT
   - Incluir avisos de copyright en package.json
   - No requiere redistribución de código fuente modificado

2. Creative Commons (iconos)
   - Atribución adecuada en documentación
   - Verificar compatibilidad con uso comercial

3. Google Fonts (SIL Open Font License)
   - Uso libre para proyectos comerciales
   - Recomendable mencionar en documentación

## Plan de implementación técnica

### Cumplimiento básico del RGPD

Tareas backend:

1. Añadir campos de consentimiento al modelo de usuario.
2. Crear endpoint de exportación de datos (GET /api/profile/data-export)
3. Crear endpoint de eliminación de cuenta (DELETE /api/profile)
4. Implementar validación y sanitización de inputs con express-validator
5. Implementar rate limiting con express-rate-limit
6. Instalar y configurar helmet para seguridad de headers HTTP
7. Configurar CORS restrictivo para producción

Tareas frontend:

1. Añadir casilla de consentimiento en formulario de registro
2. Crear página de política de privacidad
3. Añadir sección de gestión de datos en perfil de usuario (exportar datos, eliminar cuenta)


### Publicación de políticas legales

Publicar políticas legales en la web y hacerlas accesibles a los usuarios.

Tareas:

1. Crear páginas estáticas para políticas (política de privacidad, términos de uso, política de cookies, aviso legal)
2. Añadir enlaces en el footer a todas las políticas
3. Implementar sistema de versiones para notificar cambios significativos

### Mejoras de seguridad y accesibilidad

Reforzar seguridad de la aplicación y mejorar accesibilidad básica.

Tareas backend:

1. Implementar logs de auditoría con winston (login fallido, cambios de contraseña, acceso a datos sensibles)
2. Implementar proceso de eliminación automática de cuentas inactivas con cron job

Tareas frontend:

1. Corregir contraste de colores (sustituir grises claros por tonos más oscuros)
2. Añadir estilos de foco globales con :focus-visible
3. Añadir aria-expanded al menú hamburguesa
4. Implementar trap focus en modales con react-focus-lock
5. Añadir aria-hidden a iconos decorativos
6. Añadir role="alert" y aria-live a notificaciones toast

### Monitorización y mejora continua

Mantener cumplimiento normativo y mejorar accesibilidad de forma continua.

Tareas:

1. Realizar auditoría de accesibilidad con Lighthouse y axe DevTools
2. Realizar pruebas con lectores de pantalla
3. Definir plan de respuesta a incidentes (responsables, plantillas, procedimientos)
4. Establecer revisión de políticas y cumplimiento

## Políticas legales

Enlaces a las políticas en formato PDF:

- [Política de privacidad](./politicas/politica-privacidad.pdf)
- [Términos de uso](./politicas/terminos-condiciones.pdf)
- [Política de cookies](./politicas/cookies.pdf)

## Documentación adicional

Para un análisis más exhaustivo y detallado de cada aspecto legal y normativo, se ha desarrollado documentación complementaria que profundiza más: [documentación-legislación](./documentacion-legislacion.md)

