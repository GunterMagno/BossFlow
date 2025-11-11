# PR: Preparar Release versión X.Y.Z

## Tipo de versión
- [ ] PATCH (corrección sin romper compatibilidad)
- [ ] MINOR (nueva funcionalidad sin romper compatibilidad)
- [ ] MAJOR (cambios que rompen compatibilidad)

## Descripción
Qué entra en esta release y por qué se cierra esta versión ahora.

## Contenido
Lista resumida de PRs / features / fixes incluidos (links a PRs previos)

## Evidencia QA (Staging / Pre producción)
Adjuntar resultados / reportes / screenshots / smoke test

## Checklist antes de pasar a branch release/X.Y.Z
- [ ] Todas las pruebas pasan en develop
- [ ] No hay issues abiertos bloqueantes
- [ ] Documentación de cambios está actualizada
- [ ] Se definió el número final `X.Y.Z`
- [ ] No merge directo a `main`

## @Mentions
Quién debe revisar/aprobar antes de generar release/X.Y.Z
