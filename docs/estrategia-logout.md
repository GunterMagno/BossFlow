# Documentación de la funcionalidad de Logout

**Responsable:** Alejandro Borrego Cruz (developer)
**Sprint:** 2
**Fecha:** 18/11/2025

## Estrategia de logout

La funcionalidad de logout permite al usuario finalizar su sesión de manera segura, eliminando cualquier rastro de autenticación tanto en el cliente como en el servidor. El flujo es el siguiente:

1. **Cliente**:

   * Al pulsar el botón de logout, se dispara una acción que limpia los tokens de autenticación (JWT) almacenados en **localStorage** o **sessionStorage**.
   * Se actualiza el estado global (por ejemplo, `user` en un context o store) a `null` para reflejar que no hay usuario logeado.
   * Se redirige al usuario a la página de login o landing.

2. **Servidor**:

   * Se expone un endpoint opcional `/logout`.
   * Responde con un estado HTTP 200 confirmando el cierre de sesión.

## Endpoint `/logout`

* **Método:** `POST`
* **Ruta:** `/api/auth/logout`
* **Autenticación:** Requerida
* **Cuerpo:** No requiere parámetros
* **Respuesta exitosa:**

```json
{
  "message": "Sesión cerrada existosamente"
}
```

* **Errores posibles:**

  * `401 Unauthorized`: Token inválido o sesión no activa.
  * `500 Internal Server Error`: Problema en el servidor al procesar la solicitud.