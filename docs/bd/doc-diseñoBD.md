# Diseño de la base de datos

## Colección Usuarios

### Campos

| Campo | Tipo | Requerido | Default | Descripción |
|-------|------|-----------|---------|-------------|
| id | string (UUID) | sí | auto | identificador único (PK) — UUID (uuid v4)
| correo | string | sí |  | correo electrónico (único)
| usuario | string | sí |  | nombre de usuario (único)
| contraseña | string | sí |  | hash de la contraseña
| nombre | string | no |  | nombre del usuario
| bio | string | no | "" | bio del usuario
| rol | String| sí | usuario | rol del usuario
| fechaCreación | object { fecha: date, hora: string } | sí | 
| preferencias | Object | no | {} | Configuración (tema, idioma, etc.) |
| contadorDiagramas | Number | no | 0 | Número de diagramas creados |auto | fecha y hora separados: `fecha` y `hora` ("HH:MM:SS")
| eliminado | boolean | sí | false | borrado lógico

### Reglas / Restricciones

 - únicos:
   - `correo`
   - `usuario`
 - índices recomendados:
   - `{ correo: 1 }` (único)
   - `{ usuario: 1 }` (único)
   - `{ "fechaCreación.fecha": -1 }` (para ordenar por fecha de registro)
 - validaciones:
   - `correo`: formato válido de email.
   - `rol`: debe ser un rol válido.
   - `contadorDiagramas`: debe ser >= 0; se actualiza automáticamente al crear/eliminar diagramas.

---
---

## Colección Diagramas

### Campos

| Campo | Tipo | Requerido | Default | Descripción |
|-------|------|-----------|---------|-------------|
| id | Number | sí |  | ID autoincremental local por usuario |
| usuarioId | String (UUID) | sí |  | Referencia al propietario |
| titulo | String | sí |  | Nombre del diagrama |
| descripcion | String | no | "" | Descripción opcional |
| comentarios | Objeto | no | [] | Comentarios del diagrama |
| exportaciones | Objeto | no | [] | Historial de exportaciones |
| juego | String (enum) | no | "" | Filtro por juego |
| visibilidad | enum (privado, organizacion, publico) | sí | privado | control de acceso
| fechaCreación | object { fecha: date, hora: string } | sí | auto | fecha y hora separados de la creación
| fechaActualización | object { fecha: date, hora: string } | sí | auto | fecha y hora de la última modificación
| compartidoCon | Array de objetos | no | [] | Lista de usuarios con permisos locales en este diagrama. Ej: `[{"usuarioId": UUID, "permiso": "editor"}]` |


### Reglas / Restricciones

 - únicos:
   - `{ usuarioId, titulo }` (compuesto) — evita títulos duplicados por usuario
   - `{ usuarioId, id }` (compuesto) — garantiza que el id autoincremental es único dentro del usuario
 - índices:
   - `{ usuarioId: 1 }` — para consultas "todos los diagramas de un usuario.
   - `{ visibilidad: 1 }` — para filtrar por públicos/privados
   - `{ "fechaCreación": -1 }` — para ordenar por fecha de creación
   - `{ juego: 1 }` — si se usa filtrado por juego
 - validaciones:
   - `id`: debe ser >= 1 (generado automáticamente por contador local por usuario)
   - `usuarioId`: debe ser UUID v4 válido y existir en colección de Usuarios
   - `visibilidad`: debe ser uno de `["privado", "organizacion", "publico"]`
   - `compartidoCon`: cada UUID debe existir en colección Usuarios y debe ser un permiso válido

---
---

## Colección Nodos

Decisión de diseño (colección separada):
`Nodos` como colección propia con `diagramaId` como FK. Recomendado para diagramas grandes o cuando hay colaboración de muchos usuarios. Esto mejora la escalabilidad y permite más control.


### Campos

| Campo | Tipo | Requerido | Default | Descripción |
|-------|------|-----------|---------|-------------|
| id | Number | sí |  | ID autoincremental local por diagrama |
| diagramaId | Number | sí |  | ID del diagrama al que pertenece |
| etiqueta | String | sí |  | Nombre o etiqueta del nodo |
| tipo | String | sí | "accion" | Enum: ['inicio', 'accion', 'decision', 'fin'] |
| posicion | Object | sí | `{x:0, y:0}` | Coordenadas del nodo|
| conexiones | Array de idNodos | no | [] | IDs de los nodos conectados |
| metadatos | Object | no | {} | Propiedades extra (atributos, datos, etc.) |
| editable | Boolean | no | true | Indica si el nodo se puede editar |

### Reglas / Restricciones

 - únicos:
   - `{ diagramaId, id }` (compuesto) — garantiza que el id autoincremental es único dentro del diagrama
 - índices:
   - `{ diagramaId: 1 }` — para consultar todos los nodos de un diagrama
   - `{ diagramaId: 1, tipo: 1 }` — para filtrar nodos por tipo dentro de un diagrama
   - `{ diagramaId: 1, id: 1 }` — búsqueda rápida de un nodo concreto
 - validaciones:
   - `id`: debe ser >= 1 (generado automáticamente)
   - `diagramaId`: debe existir en colección Diagramas y ser >= 1
   - `tipo`: debe ser uno válido
   - `posicion.x` y `posicion.y`: deben ser números positivos y dentro del tamaño del diagrama
   - `conexiones[]`: cada id debe existir como nodo dentro del mismo diagrama
   - `editable`: debe ser booleano

---
---

## Relaciones

La base de datos utiliza tres colecciones independientes: **Usuarios**, **Diagramas** y **Nodos**:

### Usuarios → Diagramas (propiedad)

Cada usuario puede crear y poseer múltiples diagramas. La relación se mantiene mediante el campo `usuarioId` en cada documento de `Diagrama`, que referencia al UUID del usuario propietario. Esta es una relación **1-n** (un usuario tiene muchos diagramas).


### Usuarios ↔ Diagramas (colaboración)

Los usuarios pueden colaborar en diagramas ajenos mediante el campo `compartidoCon` dentro de cada `Diagrama`. Este campo es un array de objetos con la forma `{ usuarioId: UUID, permiso: "visualizador" | "editor" }`. Esto es una relación **n-m** (muchos usuarios pueden colaborar en muchos diagramas).


### Diagramas → Nodos (composición)

Un diagrama agrupa muchos nodos. Cada `Nodo` contiene el campo `diagramaId` que referencia el id numérico del diagrama al que pertenece. Esta es una relación **1-n** (un diagrama está compuesto de muchos nodos).

### Nodos ↔ Nodos (conexiones)

Las conexiones entre nodos dentro del mismo diagrama se guardan mediante el campo `conexiones` en cada `Nodo`. Este campo es un array de ids de otros nodos dentro del mismo diagrama. Esto representa una relación **n-m** (un nodo puede conectarse a muchos nodos, y ser destino de muchas conexiones).