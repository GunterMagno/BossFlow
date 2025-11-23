# Nodos personalizados

Este documento explica cómo añadir un nuevo tipo de nodo con su propio diseño SVG en el proyecto.

Resumen rápido
- Crear el componente del nodo (React) en `frontend/src/components/nodes/Nodes.jsx` o en un nuevo fichero y exportarlo.
- Crear o reutilizar un icono SVG como componente React en `frontend/src/components/nodes/icons.jsx` (usar `currentColor` para permitir recoloreado vía CSS).
- Registrar el nuevo tipo en el mapeo `nodeTypes` que usa `FlowMap` (exportar/importar y añadir la entrada en `tiposNodos`).

Pasos detallados

1) Añadir el componente del nodo directamente en `Nodes.jsx`:

```jsx
export const MyCustomNode = ({ id, data }) => (
  <div className="node mycustom-node" style={{ position: 'relative' }}>
    {/* Usa variables CSS para el color: */}
    {/* Pasa el id del nodo para generar handles únicos: */}
    <Handles nodeId={id} color={'var(--node-mycustom, var(--node-default))'} />
    <span className="icon"><MyCustomIcon className="node-icon" role="img" aria-label={`Icono de mycustom`} /></span>
    <span className="node-title">{data.title}</span>
  </div>
);
```



2) Crear el icono SVG como componente React

   - Añade en `frontend/src/components/nodes/icons.jsx` un nuevo export:

```jsx
export const MyCustomIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...props}>
    <path d="..." stroke="currentColor" fill="none" strokeWidth="1.5" />
  </svg>
);
```

   - Usar `stroke="currentColor"` y/o `fill="currentColor"` permite controlar el color desde CSS (por ejemplo `.mycustom-node { color: #123456 }`).
   - En JSX/React usa nombres de atributo en camelCase para SVG: `strokeWidth`, `strokeLinecap`, `strokeLinejoin`.
   - Prefiere exports nombrados (`export const MyCustomIcon`) y úsalos con imports nombrados. Un `export default` con un objeto también funciona, pero puede inducir inconsistencias; los ejemplos del proyecto usan exports nombrados.

3) Registrar el tipo en `FlowMap`

   - Importa tu componente en `FlowMap.jsx` y añade la clave al objeto `tiposNodos`:

```js
import { MyCustomNode } from '../nodes/Nodes';
const tiposNodos = { decision: DecisionNode, action: ActionNode, mycustom: MyCustomNode, /* ... */ };
```

   - Ahora cuando crees un nodo con `type: 'mycustom'` React Flow lo renderizará con tu componente.

4) Styles y color

  - Añade en `Nodes.css` reglas para el `className` del nodo o usa variables:

```css
.mycustom-node { border: 2px solid var(--node-mycustom, #aabbcc); background: rgba(170,187,204,0.12); color: var(--node-mycustom, #aabbcc); }
.mycustom-node .node-icon { width: 18px; height: 18px; }
```

  - Al usar `currentColor` en el SVG, el icono tomará `color` del contenedor (`.mycustom-node { color: ... }`).

5) Buenas prácticas

   - Usa `React.memo` para nodos que no cambian frecuentemente.
  - Asigna `id` y handles únicos si creas handles personalizados. Recomendación práctica: usa el `id` del nodo para componer los ids de handle, por ejemplo `id={`${id}-${name}-target`}` y `id={`${id}-${name}-source`}` para evitar colisiones entre instancias.
   - Añade `role="img"` y `aria-label` a iconos para accesibilidad.
   - Testea en el editor que `type` coincide con la clave usada en `tiposNodos`.

Ejemplo completo mínimo

1. En `icons.jsx`:
```jsx
export const MyCustomIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...props}>
    <path d="M..." stroke="currentColor" fill="none" />
  </svg>
);
```

2. En `Nodes.jsx`:
```jsx
import { MyCustomIcon } from './icons';
export const MyCustomNode = ({ id, data }) => (
  <div className="node mycustom-node">
    <MyCustomIcon className="node-icon" aria-label={`Icono de mycustom`} />
    <span className="node-title">{data.title}</span>
  </div>
);
```

3. En `FlowMap.jsx`:
```js
import { MyCustomNode } from '../nodes/Nodes';
const tiposNodos = { decision: DecisionNode, action: ActionNode, mycustom: MyCustomNode };
```

Con esto tendrás un nuevo tipo de nodo con su propio diseño SVG, control de color por CSS y registro en el editor.

Si quieres, puedo:
- añadir un ejemplo `MyCustomNode` ya listo en `Nodes.jsx`, o
- añadir el override por `data.icon` para cargar SVGs externos o desde `public`.
