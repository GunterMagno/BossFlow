# Documentación del flujo de autenticación

**Responsable:** Jesús López Pérez (Scrum Master)
**Sprint:** 2
**Fecha:** 16/11/2025

---

## 1. Diagrama de flujo de autenticación

![Diagrama de flujo de autenticación](image3.png)

---

## 2. Endpoints usados

- **POST `/api/auth/login`**

  - Recibe: `{ correo, contrasena }`
  - Devuelve: `{ user, token }`

- **POST `/api/auth/register`**

  - Recibe: `{ nombreUsuario, correo, contrasena }`
  - Devuelve: `{ user, token }`

- **GET `/api/auth/check`**

  - Requiere header `Authorization: Bearer <token>`
  - Devuelve: `{ user }` si el token es válido

- **POST `/api/auth/logout`** (solo frontend)
  - Borra el token del localStorage

---

## 3. Manejo de tokens

- El JWT recibido tras login/register se guarda en `localStorage` bajo la clave `token`.
- En cada petición protegida, se añade el header:
  - `Authorization: Bearer <token>`
- Al cerrar sesión, se elimina el token de `localStorage` y se limpia el estado global.
- Si el token expira o es inválido, el usuario es deslogueado automáticamente.

---

## 4. Flujo resumido paso a paso

1. El usuario accede a Login o Registro.
2. Envía sus datos al backend (`/api/auth/login` o `/api/auth/register`).
3. Si son válidos, el backend responde con un JWT y los datos del usuario.
4. El frontend guarda el JWT en `localStorage` y lo usa en cada petición protegida.
5. Si el usuario cierra sesión, se borra el JWT y se redirige a Login.
6. Si el JWT expira, el usuario es deslogueado automáticamente.
