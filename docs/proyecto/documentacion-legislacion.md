# Legislación y Cumplimiento Normativo — BossFlow

Este documento extiende `legislación.md`.

## 1. Protección de Datos — RGPD (Reglamento General de Protección de Datos)

BossFlow recoge datos personales de usuarios europeos (residentes en la Unión Europea), por lo que debe cumplir con el **RGPD** (Reglamento (UE) 2016/679). A continuación se detallan los aspectos clave a implementar:

### 1.1. Consentimiento explícito

El RGPD exige que el tratamiento de datos personales se base en el consentimiento libre, específico, informado e inequívoco del usuario mediante una acción afirmativa clara. No se permiten casillas premarcadas ni consentimiento implícito.


### 1.2. Información transparente

El RGPD obliga a proporcionar información clara, concisa y accesible sobre el tratamiento de datos en lenguaje sencillo. La política de privacidad debe estar disponible antes de la recogida de datos e informar sobre:

- **Datos recogidos:** Nombre de usuario, email, contraseña cifrada, avatar, biografía, preferencias de juegos, diagramas e imágenes.
- **Finalidades:** Registro, autenticación, provisión de servicios y envío de correos de verificación.
- **Base legal:** Consentimiento del usuario y ejecución del contrato de servicios.
- **Destinatarios:** Proveedores de hosting y servicios de correo (Gmail SMTP).
- **Derechos del usuario:** Acceso, rectificación, supresión, portabilidad, oposición y limitación.
- **Plazo de conservación:** Criterios claros según finalidad.
- **Transferencias internacionales:** Países destino y garantías aplicadas.
- **Contacto:** Datos del responsable y delegado de protección de datos (si procede).

La política debe estar accesible permanentemente (pie de página y formulario de registro). Los cambios sustanciales deben notificarse con antelación.

### 1.3. Derechos de los usuarios

El RGPD otorga a los usuarios los siguientes derechos fundamentales:

- **Acceso:** El usuario puede solicitar una copia de todos sus datos personales almacenados.
- **Rectificación:** El usuario puede corregir datos inexactos o incompletos.
- **Supresión (derecho al olvido):** El usuario puede solicitar la eliminación de sus datos personales cuando ya no sean necesarios, retire su consentimiento o se oponga al tratamiento.
- **Portabilidad:** El usuario puede obtener sus datos en un formato estructurado, de uso común y legible por máquina (por ejemplo JSON) y, si es técnicamente posible, transmitirlos a otro responsable.
- **Oposición:** El usuario puede oponerse al tratamiento de sus datos por motivos legítimos.
- **Limitación del tratamiento:** En ciertos casos el usuario puede solicitar que se restrinja el tratamiento de sus datos.

### 1.4. Seguridad de los datos

El RGPD exige aplicar medidas técnicas y organizativas apropiadas para garantizar un nivel de seguridad adecuado al riesgo del tratamiento. Requiere evaluación continua de riesgos considerando naturaleza, ámbito, contexto y fines del tratamiento.

**Medidas obligatorias:**
- Seudonimización y cifrado de datos personales
- Garantía de confidencialidad, integridad, disponibilidad y resiliencia de sistemas
- Capacidad de restauración rápida en caso de incidentes
- Verificación regular de la eficacia de las medidas implementadas

### 1.5. Notificación de brechas de seguridad

Se considera violación de seguridad cualquier incidente que ocasione destrucción, pérdida, alteración o acceso no autorizado a datos personales (accesos indebidos, pérdida de dispositivos, ataques informáticos, errores humanos o fallos técnicos).

**Obligaciones de notificación:**

1. **A la autoridad de control (AEPD en España):** 
   - Plazo máximo: 72 horas desde conocimiento del incidente
   - Contenido: Naturaleza de la violación, número de afectados, datos del DPO/contacto, consecuencias y medidas correctoras

2. **A los interesados afectados:**
   - Cuando entrañe alto riesgo para derechos y libertades
   - Lenguaje claro con recomendaciones de protección
   - Excepciones: Datos cifrados, riesgo ya mitigado o esfuerzo desproporcionado

**Procedimientos internos requeridos:**
- Definir responsabilidades y canales de escalado
- Establecer detección, análisis, contención y recuperación
- Documentar todas las violaciones (incluso las no notificadas)
- Proceso de notificación interna y externa

### 1.6. Delegado de protección de datos

El DPO (Data Protection Officer) actúa como punto de contacto entre la organización, interesados y autoridades de control. Su designación es **obligatoria** cuando:

1. El tratamiento lo realiza una autoridad u organismo público
2. Las actividades principales requieren observación habitual y sistemática de usuarios a gran escala (marketing comportamental, seguimiento de ubicación, perfilado masivo)
3. Se tratan a gran escala categorías especiales de datos sensibles (origen étnico, opiniones políticas, datos de salud, biométricos, etc.)

**Características del DPO**:
- Puede ser personal interno o servicio externo
- Requiere cualificaciones profesionales y conocimientos especializados
- Sus datos de contacto deben publicarse y comunicarse a la autoridad de control

En este caso, no existe obligación de designar DPO al ser un proyecto de pequeña escala que trata únicamente datos básicos (registro, autenticación, contenido generado) sin categorías especiales ni observación sistemática a gran escala.

### 1.7. Plazo de conservación de los datos

El RGPD establece que los datos personales deben conservarse solo durante el tiempo necesario para los fines del tratamiento. El responsable debe determinar el período de conservación o criterios objetivos para determinarlo.

**Criterios de determinación:**
- Finalidad específica de la recogida
- Obligaciones legales de conservación (fiscal, mercantil, laboral)
- Necesidades de gestión de reclamaciones

**Supresión y anonimización:**
Cuando los datos ya no sean necesarios, deben suprimirse o anonimizarse irreversiblemente (información estadística sin identificación personal).


### 1.8. Transferencias internacionales de datos

Las transferencias de datos fuera del Espacio Económico Europeo solo pueden realizarse garantizando un nivel de protección equivalente al RGPD.

**Mecanismos de legitimación:**

1. **Decisión de adecuación de la UE:** País reconocido con protección equivalente. Tras Schrems II, requiere evaluación caso por caso.

2. **Garantías adecuadas:**
   - **SCC (Standard Contractual Clauses):** Cláusulas contractuales tipo aprobadas por la Comisión Europea (actualizadas en 2021)
   - **BCR (Binding Corporate Rules):** Normas corporativas vinculantes para grupos empresariales
   - Mecanismos de certificación y códigos de conducta aprobados

3. **Excepciones específicas:**
   - Consentimiento explícito tras información de riesgos
   - Necesidad para ejecución de contrato
   - Razones importantes de interés público


## 2. Política de cookies

### 2.1. ¿BossFlow utiliza cookies?

Actualmente no se utilizan cookies para autenticación ni para seguimiento de usuarios.

- **Autenticación:** Se basa en **tokens JWT** almacenados en `localStorage` del navegador y enviados en headers HTTP (`Authorization: Bearer <token>`).
- **Sesiones:** No se usan cookies de sesión; el estado de autenticación se gestiona enteramente mediante JWT.
- **Analytics/Publicidad:** Actualmente no se integran servicios de analytics (Google Analytics, Matomo, etc.) ni de publicidad que usen cookies.

### 2.2. Recursos de terceros (Google Fonts)

Actualmente, el frontend de BossFlow carga Google Fonts desde `https://fonts.googleapis.com` (ver `frontend/src/index.css`). Esto implica que el navegador del usuario envía peticiones HTTP a servidores de Google, lo que puede incluir la dirección IP del usuario y otros metadatos (User-Agent, referer, etc.). Según la normativa de ePrivacy y el RGPD, cargar recursos de terceros que puedan recoger datos del usuario (incluso sin cookies) necesita consentimiento. Por lo que se informa de ello en la Política de Privacidad sobre el uso de Google Fonts.

### 2.3. Cookies en futuro

Si se decide incorporar cookies (sesiones, analytics, publicidad) en un futuro, será necesario implementar:

#### 1 Banner de cookies

Se implementará un banner para informar al usuario sobre el uso de cookies antes de que se instalen (excepto cookies estrictamente necesarias para el funcionamiento del servicio).
Su contenido será:
    - Qué cookies se usan.
    - Finalidad de cada categoría (técnicas, analíticas, publicitarias, de personalización).
    - Enlace a la Política de Cookies completa.

Además se solicitará consentimiento explícito y no se instalarán cookies no esenciales hasta que el usuario acepte.

#### 2 Clasificación de cookies

| Categoría             | Descripción                                                                 | Requiere consentimiento |
|-----------------------|-----------------------------------------------------------------------------|--------------------------|
| **Técnicas/Esenciales** | Necesarias para el funcionamiento básico del sitio (ej. sesión de login). | No                       |
| **De personalización**  | Guardan preferencias del usuario (ej. idioma, tema).                       | Sí                       |
| **Analíticas**          | Miden el tráfico y comportamiento (ej. Google Analytics).                 | Sí                       |
| **Publicitarias**       | Sirven anuncios personalizados.                                            | Sí                       |

####  3 Gestión de preferencias

- Permitir al usuario **aceptar/rechazar** cada categoría de cookies no esenciales.
- Ofrecer opción de cambiar preferencias en cualquier momento (enlace en pie de página: "Configurar cookies").
- Respetar la elección del usuario y no instalar cookies rechazadas.

#### 4 Política de Cookies

Se creará un documento separado que detalle:
  - Lista completa de cookies usadas (nombre, finalidad, duración, proveedor).
  - Cómo desactivar cookies desde el navegador.
  - Enlaces a políticas de privacidad de terceros (Google, Facebook, etc.).


## 3. Accesibilidad web — WCAG 2.1

### 3.1. Obligación legal

En muchos países, incluida **España**, las páginas web públicas y de empresas deben cumplir criterios de **accesibilidad** para garantizar que todas las personas, incluidas aquellas con discapacidades, puedan acceder y utilizar los servicios digitales.

- **Marco normativo en España:**
  - **Real Decreto 1112/2018** sobre accesibilidad de los sitios web y aplicaciones para dispositivos móviles del sector público.
  - **Ley General de derechos de las personas con discapacidad y de su inclusión social** (Real Decreto Legislativo 1/2013).
  - **Norma UNE-EN 301549** (estándar europeo que referencia WCAG 2.1).
  
- Norma de referencia internacional: WCAG 2.1 (Web Content Accessibility Guidelines) — Directrices de Accesibilidad para el Contenido Web, publicadas por el W3C (World Wide Web Consortium).

- **Niveles de conformidad:**
  - **Nivel A:** Requisitos mínimos de accesibilidad.
  - **Nivel AA:** Conformidad recomendada (estándar en la mayoría de legislaciones).
  - **Nivel AAA:** Máximo nivel de accesibilidad (opcional, difícil de alcanzar en todos los contextos).

**Aplicación a BossFlow:**
- Como plataforma web pública que potencialmente podría ser usada por entidades educativas, organismos o empresas, es recomendable cumplir al menos con el **nivel AA** de WCAG 2.1.
- Aunque BossFlow es actualmente un proyecto académico/sin ánimo de lucro, adoptar buenas prácticas de accesibilidad mejora la experiencia de todos los usuarios y amplía la audiencia potencial.

### 3.2. Principios fundamentales de WCAG

WCAG 2.1 se basa en cuatro principios (conocidos como **POUR**):

1. **Perceivable:** La información y los componentes de la interfaz deben presentarse de manera que los usuarios puedan percibirlos.
2. **Operable:** Los componentes de la interfaz y la navegación deben ser operables por todos los usuarios.
3. **Understandable:** La información y el manejo de la interfaz deben ser comprensibles.
4. **Robust:** El contenido debe ser lo suficientemente robusto como para ser interpretado de manera confiable por una amplia variedad de agentes de usuario, incluidas tecnologías de asistencia.

### 3.3. Estado de accesibilidad en BossFlow

Análisis del cumplimiento de WCAG 2.1.

#### 3.3.1. Contraste de colores 

Ratios mínimos requeridos: 
- texto normal 4.5:1 
- texto grande 3:1 
- componentes UI 3:1.

Paleta de colores verificada:
- Primario: #1F2D44 (azul oscuro)
- Secundario: #EAB308 (amarillo)
- Blanco: #F8FAFC
- Grises: #BFBFBF, #A2A2A2, #6D6D6D
- Error: #E60303


- #1F2D44 sobre #F8FAFC: ratio aproximado 13:1 (cumple)
- #EAB308 sobre #1F2D44: ratio aproximado 6:1 (cumple)
- #E60303 sobre #F8FAFC: ratio aproximado 5.2:1 (cumple)
- #BFBFBF sobre #F8FAFC: ratio aproximado 2.5:1 (no cumple para texto normal)
- #A2A2A2 sobre #F8FAFC: ratio aproximado 3.2:1 (no cumple para texto normal)

Problemas detectados:
- Los grises claros (#BFBFBF, #A2A2A2) usados en textos secundarios no alcanzan el ratio mínimo 4.5:1 sobre fondos claros
- Algunos estados hover usan var(--gris2) que puede ser insuficiente

Mejoras futuras:
- Sustituir --gris2 por --gris4 (#818181) o más oscuro para textos sobre fondo claro
- Verificar contraste en estados hover/focus/active de todos los botones
- Auditar con herramientas automatizadas (WebAIM, axe DevTools)

#### 3.3.2. Navegación por teclado

Los botones y elementos interactivos son accesibles mediante teclado. Los formularios muestran un indicador visual cuando el usuario navega con el teclado.

#### 3.3.3. Etiquetas alt en imágenes

Todas las imágenes tienen descripciones alternativas que explican su contenido, como el logo de la aplicación. Los iconos que tienen una función específica también incluyen descripciones para usuarios que no pueden verlos.

#### 3.3.4. Estructura semántica HTML5

La estructura del código utiliza etiquetas semánticas correctamente, lo que ayuda a los lectores de pantalla a entender la organización del contenido. Cada página tiene una jerarquía clara de encabezados con un título principal único, y el idioma español está correctamente identificado. Las ventanas emergentes están bien señalizadas como diálogos.

#### 3.3.5. Compatibilidad con lectores de pantalla

Todos los campos de los formularios están correctamente etiquetados, lo que permite a los usuarios con lectores de pantalla entender qué información deben introducir en cada campo. Los campos relacionados están agrupados de forma lógica y los mensajes de error en formularios se anuncian correctamente.

## 4. Propiedad intelectual

BossFlow utiliza diversos recursos de terceros que están sujetos a licencias de uso y cumple con todas las obligaciones de las licencias. A continuación se detalla el uso de estos recursos en la aplicación.

### 4.1. Iconos y recursos gráficos

BossFlow utiliza iconos de la biblioteca react-icons, que incluye colecciones de iconos con licencias libres. Los iconos utilizados en la aplicación no requieren pago de licencias y están correctamente licenciados para uso en el proyecto.

### 4.2. Fuentes tipográficas

Google Fonts se carga desde fonts.googleapis.com con las fuentes utilizadas en la aplicación. Estas fuentes están disponibles bajo licencias de código abierto  que permiten uso comercial y modificación.

### 4.3. Bibliotecas y frameworks

Todas las bibliotecas de código utilizadas en BossFlow tienen licencias de código abierto compatibles con uso comercial:

Frontend:
- React: Licencia MIT
- Vite: Licencia MIT
- React Router: Licencia MIT
- Axios: Licencia MIT
- ReactFlow: Licencia MIT

Backend:
- Express: Licencia MIT
- Mongoose: Licencia MIT
- bcrypt: Licencia MIT
- jsonwebtoken: Licencia MIT
- Nodemailer: Licencia MIT

### 4.4. APIs externas

En la aplicación no se integran APIs externas de terceros que requieran revisión de términos de servicio adicionales.

## 5. Enlaces a recursos utilizados

[RGPD (texto completo)](https://eur-lex.europa.eu/eli/reg/2016/679/oj)

[Agencia Española de Protección de Datos (AEPD)](https://www.aepd.es)
  - [Guías prácticas](https://www.aepd.es/es/guias)
  - [Herramienta Facilita RGPD (para pymes)](https://www.aepd.es/es/herramientas/facilita.html)

[Directiva ePrivacy (Cookies)](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32002L0058)

[Cláusulas contractuales tipo (SCC) de la UE](https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_en)

[Cookiebot](https://www.cookiebot.com)

[Tarteaucitron.js](https://tarteaucitron.io)

[WCAG 2.1 (oficial)](https://www.w3.org/TR/WCAG21/)

[WebAIM (Web Accessibility in Mind)](https://webaim.org/)

[A11y Project](https://www.a11yproject.com/)

[MDN Web Docs — Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

[Real Decreto 1112/2018 (España)](https://www.boe.es/eli/es/rd/2018/09/21/1112)


