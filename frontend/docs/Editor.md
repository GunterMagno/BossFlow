# Componente Editor - Documentación

Esta página documenta el componente `Editor` y su integración con React Flow (`FlowMap`). Incluye la estructura del componente, cómo se gestionan el estado y las props, y ejemplos de uso.

## Archivos

**Archivo:** `frontend/src/pages/Editor.jsx` : Componente de página que engloba la UI del editor (Toolbar, Sidebar y el canvas principal).

**Componente canvas:** `frontend/src/components/FlowMap/FlowMap.jsx` : Contiene el lienzo de React Flow y administra el estado local de nodos y conexiones.


## Estructura

```jsx
 return (
    <ReactFlowProvider>
      <div className="editor__page">
        <Toolbar />

        <Sidebar />

        {/* Componente que contiene el canvas principal */}
        <div className="editor__canvas">
          <FlowMap initialNodes={nodes} initialEdges={edges} />
        </div>
      </div>
    </ReactFlowProvider>
  );
```

Explicación de la estructura:

- `ReactFlowProvider`: proveedor de contexto de `reactflow`. Envuelve el área del editor para que los hooks y componentes de React Flow (por ejemplo `useNodesState`, `useEdgesState`, y el propio canvas) puedan compartir estado y utilidades. Se coloca a nivel de página para que cualquier componente hijo relacionado con el canvas pueda acceder al contexto.
- `div.editor__page`: contenedor principal de la página del editor.
- `<Toolbar />`: componente de barra superior que contiene acciones globales del editor (guardar, deshacer/rehacer, zoom, botones de export/import, etc.). Está separado del canvas para mantener la UI modular.
- `<Sidebar />`: panel lateral con herramientas, paleta de nodos o metadatos del diagrama. Permite al usuario arrastrar/soltar nodos al canvas o ajustar propiedades del elemento seleccionado.
- `<div className="editor__canvas">`: área principal donde se renderiza el lienzo de edición. Aquí se reserva el espacio y se aplica la hoja de estilos para el tamaño y comportamiento del canvas.
- `<FlowMap initialNodes={nodes} initialEdges={edges} />`: componente que contiene el `ReactFlow` canvas y gestiona la representación y edición de nodos y conexiones. Recibe `initialNodes`/`initialEdges` desde el `Editor` (estado cargado desde la API o vacío para diagramas nuevos) y gestiona internamente el estado de los elementos mientras el usuario interactúa.


## Integración React Flow
La integración entre `Editor` y React Flow se separa en dos responsabilidades: el `Editor` se encarga de definir la página con una estructura y el manejo de datos del diagrama, mientras que `FlowMap` se encarga de la representación y edición interactiva. Concretamente, `Editor` obtiene opcionalmente un `diagramaId` de la ruta (`useParams`) y, si existe, solicita el diagrama al backend mediante `getDiagramById`; una vez recibidos, pasa los nodos y las conexiones a `FlowMap` como `initialNodes` e `initialEdges`. Por su parte, `FlowMap` utiliza las utilidades de `reactflow` (`useNodesState` y `useEdgesState`) para mantener el estado local del lienzo y para renderizar y gestionar las interacciones del usuario (arrastrar nodos, crear o eliminar conexiones, editar propiedades, etc.). Esta separación evita mezclar responsabilidades y permite que el canvas sea reactivo y que las ediciones locales del usuario no se pierdan.

## Estado y propiedades
- **En `Editor.jsx`:**
  - **`nodes` (state):** array que contiene los nodos del diagrama (inicialmente `[]`).
  - **`edges` (state):** array que contiene las conexiones/conexiones (inicialmente `[]`).
  - **`loading` (state):** booleano que indica si se está cargando el diagrama desde la API.
  - **`error` (state):** error devuelto al cargar el diagrama.

- **En `FlowMap` (propiedades / estado interno):**
  - **Propiedad:** `initialNodes` (array) — datos iniciales que `Editor` pasa al abrir un diagrama existente.
  - **Propiedad:** `initialEdges` (array) — conexiones iniciales pasadas desde `Editor`.
  - **Estado interno:** `useNodesState(initialNodes)` y `useEdgesState(initialEdges)` mantienen el estado del editor mientras el usuario interactúa.
  - **Inicialización segura:** `FlowMap` implementa una inicialización controlada (solo la primera vez que llegan datos reales) usando `useRef` para evitar sobrescribir las ediciones del usuario si el componente Editor vuelve a renderizar o pasa elementos vacíos.

