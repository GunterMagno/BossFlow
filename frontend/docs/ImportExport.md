# Importación/Exportación JSON

Sistema de importación y exportación de diagramas en formato JSON con validación y control de versiones.

## Características

**Exportación**: Genera archivo JSON con metadatos completos (título, fecha, contadores), serializa nodos con posición, tipo, data y estilos, serializa conexiones con source, target, handles y propiedades. Incluye versionado automático y nombre de archivo con timestamp.

**Importación**: Validación de estructura JSON, verificación de versión compatible, preview de contenido antes de importar con mensajes de error descriptivos. Se integra en la creación de diagramas.

## Formato JSON

```json
{
  "version": "1.0.0",
  "metadata": {
    "title": "Nombre del diagrama",
    "exportedAt": "2024-12-04T10:30:00.000Z",
    "exportedBy": "BossFlow",
    "nodeCount": 5,
    "edgeCount": 4
  },
  "diagram": {
    "nodes": [
      {
        "id": "node-1",
        "type": "start",
        "position": { "x": 100, "y": 100 },
        "data": { "label": "Inicio" },
        "style": {}
      }
    ],
    "edges": [
      {
        "id": "edge-1",
        "source": "node-1",
        "target": "node-2",
        "sourceHandle": null,
        "targetHandle": null,
        "type": "default",
        "data": {},
        "style": {},
        "animated": false,
        "label": ""
      }
    ]
  }
}
```

## Validación

**Archivo** (`jsonValidator.js`)
- `isValidJSONFile()` - Verifica extensión .json
- `validateJSONStructure()` - Valida campos requeridos
- `validateNodes()` - Verifica array de nodos
- `validateEdges()` - Verifica array de conexiones
- `isVersionCompatible()` - Comprueba compatibilidad de versión

**Reglas**
- Versión actual: 1.0.0
- Versiones compatibles: 1.0.0
- Campos obligatorios: version, metadata, diagram
- Nodos requieren: id, type, position, data
- Edges requieren: id, source, target

## Componentes

**useExportDiagram.js**: `exportToJSON()` exporta diagrama actual a JSON, genera metadata automáticamente, serializa estado completo de ReactFlow y descarga archivo con nombre timestamped.

**ImportJSON.jsx**: Modal de importación con preview, validación en tiempo real, alertas de incompatibilidad e integración con validadores.

**NewDiagramModal.jsx**: Opción de importar al crear diagrama, badge de confirmación cuando se importa, pre-rellena título con metadata y carga nodos/edges importados.

## Uso

**Exportar**
```javascript
const { exportToJSON } = useExportDiagram('mi-diagrama');
exportToJSON(); // Descarga: mi-diagrama_2024-12-04_10-30.json
```

**Importar**
1. Click en "Importar desde JSON" en NewDiagramModal
2. Seleccionar archivo .json
3. Revisar preview con contadores
4. Confirmar importación
5. Completar formulario y guardar

## Compatibilidad

El sistema mantiene retrocompatibilidad con versiones antiguas mediante:
- Array `COMPATIBLE_VERSIONS` en validator
- Verificación antes de importar
- Mensaje de error específico si no compatible
- Posibilidad de añadir migradores en futuro
