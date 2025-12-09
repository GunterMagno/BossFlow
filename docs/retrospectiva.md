# Retrospectiva final del proyecto BossFlow

## Métricas

- Commits totales: 256
- Contribuidores: 3
- Entradas/expectativas en tests (conteo aproximado de `results.push`): 85
- Líneas aproximadas:
  - Backend: 333,201 líneas
  - Frontend: 65,686 líneas
  - Total (repositorio): ~403,233 líneas

## Qué funcionó bien
Comunicación: Reuniones periódicas y canales activos permitieron resolver dudas rápidamente y coordinar el trabajo del equipo.

Revisión de código: Revisiones frecuentes de PRs ayudaron a mantener calidad y compartir conocimiento entre miembros.

Distribución de tareas: Asignación clara de issues y responsabilidades redujo los problemas y mejoró la eficiencia.

Autonomía y colaboración: Miembros asumieron tareas completas (backend/frontend), favoreciendo entregas iterativas.

Ejecución de pruebas: Existen tests automatizados para endpoints críticos y un runner que facilita las comprobaciones locales.

Separación de responsabilidades: Arquitectura frontend/backend y Dockerfiles facilitaron despliegues independientes.

Documentación útil: Documentos en `docs/` y README generales ayudaron en la comunicación del proyecto.

## Areas de mejora

Integración continua / Automatización de tests: Falta un pipeline CI; integrar los tests en CI permitiría detectar regresiones en PRs y asegurar builds.

Implementar scripts de testing, facilitaría ejecución local y CI.

Pruebas end-to-end (E2E): Faltan pruebas E2E que verifiquen flujos completos entre frontend y backend antes del despliegue.

Monitorización y alertas: No hay configuración visible para staging. Hay que incorporar métricas y alertas.

Gestión de dependencias: No hay proceso automático de actualización (Dependabot/ Renovate), lo que puede generar deuda técnica.

## Lecciones aprendidas

- Separar frontend y backend con contenedores facilita despliegues independientes y rollbacks.
- Documentación mínima permite conocer que hizo cada uno.
- El funcionamiento del SCRUM y cada uno de los roles.

## Sugerencias para proyectos futuros

1. Integrar CI (GitHub Actions): pipeline que ejecute linters, `npm test` (backend), build frontend y despliegue a staging.
2. Añadir scripts que ejectes pruebas.
3. Implementar totalmente los tests para garantizar el funcionamiento.
4. Añadir plantillas correctamente para los PR o commits.
5. Añadir plantilla de documentación por módulo en `docs/` y un `docs/README.md` con un índice.
6. Añadir monitorización básica en staging (logs estructurados, métricas de endpoints críticos, alertas en errores 5xx).


