# Estructura JSON de Nodos - Schema Técnico

Especificación técnica del formato JSON para nodos y edges en BossFlow.

**Fecha de creación**: 2025-11-27  
**Sprint**: 4  
**Versión**: 1.0

---

## Índice

1. [JSON Schema - Diagrama Completo](#json-schema---diagrama-completo)
2. [JSON Schema - Nodo](#json-schema---nodo)
3. [JSON Schema - Edge](#json-schema---edge)
4. [Tipos de Nodos Disponibles](#tipos-de-nodos-disponibles)
5. [Ejemplos Completos](#ejemplos-completos)
6. [Validaciones Backend](#validaciones-backend)

---

## JSON Schema - Diagrama Completo

### Schema Formal

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["title", "nodes", "edges"],
  "properties": {
    "title": {
      "type": "string",
      "minLength": 3,
      "description": "Título del diagrama"
    },
    "description": {
      "type": "string",
      "maxLength": 500,
      "description": "Descripción opcional del diagrama"
    },
    "nodes": {
      "type": "array",
      "items": { "$ref": "#/definitions/Node" },
      "description": "Array de nodos del diagrama"
    },
    "edges": {
      "type": "array",
      "items": { "$ref": "#/definitions/Edge" },
      "description": "Array de conexiones entre nodos"
    }
  },
  "definitions": {
    "Node": {
      "type": "object",
      "required": ["id", "type", "position", "data"],
      "properties": {
        "id": {
          "type": "string",
          "description": "Identificador único del nodo"
        },
        "type": {
          "type": "string",
          "description": "Tipo de nodo (action, decision, start, end, phase, etc.)"
        },
        "position": {
          "type": "object",
          "required": ["x", "y"],
          "properties": {
            "x": { "type": "number" },
            "y": { "type": "number" }
          }
        },
        "data": {
          "type": "object",
          "description": "Datos específicos del nodo (estructura flexible)"
        }
      }
    },
    "Edge": {
      "type": "object",
      "required": ["id", "source", "target"],
      "properties": {
        "id": {
          "type": "string",
          "description": "Identificador único del edge"
        },
        "source": {
          "type": "string",
          "description": "ID del nodo origen"
        },
        "target": {
          "type": "string",
          "description": "ID del nodo destino"
        },
        "sourceHandle": {
          "type": "string",
          "description": "Handle específico del nodo origen (opcional)"
        },
        "targetHandle": {
          "type": "string",
          "description": "Handle específico del nodo destino (opcional)"
        },
        "type": {
          "type": "string",
          "enum": ["default", "straight", "step", "smoothstep", "simplebezier"],
          "description": "Tipo de conexión visual"
        },
        "animated": {
          "type": "boolean",
          "default": false,
          "description": "Si la conexión tiene animación"
        },
        "style": {
          "type": "object",
          "description": "Estilos CSS personalizados para el edge"
        },
        "data": {
          "type": "object",
          "description": "Datos adicionales del edge"
        }
      }
    }
  }
}
```

---

## JSON Schema - Nodo

### Estructura Base

Todo nodo **debe** tener estas propiedades:

```typescript
interface Node {
  id: string;           // Único en el diagrama
  type: string;         // Tipo de nodo
  position: {           // Posición en canvas
    x: number;
    y: number;
  };
  data: object;         // Datos específicos del tipo
}
```

### Modelo MongoDB (Mongoose)

```javascript
nodes: [{
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  position: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    }
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}]
```

### Validaciones Backend

El backend valida que:

- ✅ El nodo tenga `id`, `type`, `position` y `data`
- ✅ `position` contenga `x` e `y` numéricos
- ✅ No haya IDs duplicados en el mismo diagrama
- ✅ Los edges referencien nodos existentes

---

## JSON Schema - Edge

### Estructura Base

```typescript
interface Edge {
  id: string;              // Único en el diagrama
  source: string;          // ID del nodo origen (requerido)
  target: string;          // ID del nodo destino (requerido)
  sourceHandle?: string;   // Handle específico del origen
  targetHandle?: string;   // Handle específico del destino
  type?: string;           // Tipo visual de conexión
  animated?: boolean;      // Animación de flujo
  style?: object;          // Estilos CSS personalizados
  data?: object;           // Datos adicionales
}
```

### Modelo MongoDB (Mongoose)

```javascript
edges: [{
  id: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  target: {
    type: String,
    required: true
  },
  sourceHandle: {
    type: String,
    required: false
  },
  targetHandle: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: false
  },
  animated: {
    type: Boolean,
    required: false,
    default: false
  },
  style: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}]
```

### Tipos de Edge Disponibles

| Tipo | Descripción | Uso Recomendado |
|------|-------------|-----------------|
| `default` | Curva bezier suave | Conexiones generales |
| `straight` | Línea recta | Flujos directos |
| `step` | Línea con ángulos rectos | Diagramas técnicos |
| `smoothstep` | Línea con ángulos suavizados | Balance entre step y bezier |
| `simplebezier` | Curva bezier simple | Conexiones elegantes |

---

## Tipos de Nodos Disponibles

### Tipos Básicos (React Flow)

| Tipo | Descripción | Handles |
|------|-------------|---------|
| `default` | Nodo básico rectangular | Top, Right, Bottom, Left |
| `input` | Nodo de entrada | Solo Bottom |
| `output` | Nodo de salida | Solo Top |

### Tipos Personalizados (BossFlow)

| Tipo | Descripción | Propiedades `data` Recomendadas |
|------|-------------|--------------------------------|
| `action` | Acción del combate | `title`, `icon`, `description`, `damage`, `cooldown`, `targetType` |
| `decision` | Punto de decisión | `title`, `icon`, `condition`, `trueLabel`, `falseLabel` |
| `start` | Nodo de inicio | `title`, `icon` |
| `end` | Nodo de finalización | `title`, `icon`, `outcome` |
| `phase` | Fase del boss | `title`, `icon`, `phaseNumber`, `healthThreshold`, `description` |
| `process` | Proceso genérico | `label`, `timeout`, `retries`, `config` |

Consulta [`docs/NODE_TYPES.md`](./NODE_TYPES.md) para especificaciones detalladas de cada tipo personalizado.

---

## Ejemplos Completos

### Ejemplo 1: Diagrama Simple

```json
{
  "title": "Combate Básico",
  "description": "Flujo simple de ataque",
  "nodes": [
    {
      "id": "start-1",
      "type": "input",
      "position": { "x": 100, "y": 100 },
      "data": {
        "label": "Inicio"
      }
    },
    {
      "id": "action-1",
      "type": "action",
      "position": { "x": 300, "y": 100 },
      "data": {
        "title": "Ataque Básico",
        "icon": "⚔️",
        "description": "Ataque cuerpo a cuerpo",
        "damage": 50,
        "cooldown": 2,
        "targetType": "single"
      }
    },
    {
      "id": "end-1",
      "type": "output",
      "position": { "x": 500, "y": 100 },
      "data": {
        "label": "Fin",
        "outcome": "success"
      }
    }
  ],
  "edges": [
    {
      "id": "e1",
      "source": "start-1",
      "target": "action-1",
      "type": "default"
    },
    {
      "id": "e2",
      "source": "action-1",
      "target": "end-1",
      "type": "default"
    }
  ]
}
```

### Ejemplo 2: Diagrama con Decisión

```json
{
  "title": "Boss con Mecánica Condicional",
  "description": "El boss cambia de estrategia según su vida",
  "nodes": [
    {
      "id": "start",
      "type": "start",
      "position": { "x": 200, "y": 50 },
      "data": {
        "title": "Inicio de Fase",
        "icon": "🎮"
      }
    },
    {
      "id": "decision-hp",
      "type": "decision",
      "position": { "x": 200, "y": 150 },
      "data": {
        "title": "Verificar HP",
        "icon": "❓",
        "condition": "boss.hp < 50%",
        "trueLabel": "Modo Berserk",
        "falseLabel": "Modo Normal"
      }
    },
    {
      "id": "action-normal",
      "type": "action",
      "position": { "x": 100, "y": 300 },
      "data": {
        "title": "Ataque Normal",
        "icon": "⚔️",
        "damage": 100,
        "cooldown": 3
      }
    },
    {
      "id": "action-berserk",
      "type": "action",
      "position": { "x": 300, "y": 300 },
      "data": {
        "title": "Ataque Furioso",
        "icon": "💥",
        "damage": 200,
        "cooldown": 2
      }
    },
    {
      "id": "end",
      "type": "end",
      "position": { "x": 200, "y": 450 },
      "data": {
        "title": "Fin de Turno",
        "icon": "✅"
      }
    }
  ],
  "edges": [
    {
      "id": "e1",
      "source": "start",
      "target": "decision-hp",
      "type": "default"
    },
    {
      "id": "e2-false",
      "source": "decision-hp",
      "target": "action-normal",
      "type": "smoothstep",
      "sourceHandle": "false",
      "data": {
        "label": "HP >= 50%"
      }
    },
    {
      "id": "e3-true",
      "source": "decision-hp",
      "target": "action-berserk",
      "type": "smoothstep",
      "sourceHandle": "true",
      "animated": true,
      "data": {
        "label": "HP < 50%"
      }
    },
    {
      "id": "e4",
      "source": "action-normal",
      "target": "end",
      "type": "default"
    },
    {
      "id": "e5",
      "source": "action-berserk",
      "target": "end",
      "type": "default"
    }
  ]
}
```

### Ejemplo 3: Datos Anidados Complejos

```json
{
  "title": "Sistema de Procesamiento de Pedidos",
  "nodes": [
    {
      "id": "validate-node",
      "type": "process",
      "position": { "x": 300, "y": 100 },
      "data": {
        "label": "Validar Inventario",
        "timeout": 5000,
        "retries": 3,
        "config": {
          "checkStock": true,
          "reserveItems": true,
          "warehouse": {
            "location": "central",
            "priority": "high"
          }
        },
        "notifications": {
          "email": true,
          "sms": false,
          "webhook": "https://api.example.com/notify"
        }
      }
    },
    {
      "id": "payment-node",
      "type": "process",
      "position": { "x": 500, "y": 100 },
      "data": {
        "label": "Procesar Pago",
        "gateway": "stripe",
        "methods": ["card", "paypal", "bank_transfer"],
        "limits": {
          "min": 10,
          "max": 10000,
          "currency": "USD"
        },
        "metadata": {
          "department": "finance",
          "version": "2.0",
          "tags": ["payment", "critical"]
        }
      }
    }
  ],
  "edges": [
    {
      "id": "e1",
      "source": "validate-node",
      "target": "payment-node",
      "type": "smoothstep",
      "animated": true,
      "style": {
        "stroke": "#4CAF50",
        "strokeWidth": 2
      },
      "data": {
        "condition": "inventory.available === true",
        "priority": 1,
        "webhook": "https://api.example.com/flow-update"
      }
    }
  ]
}
```

---

## Validaciones Backend

### Validador de Nodos

El backend (`backend/validators/diagramValidator.js`) valida:

```javascript
// Cada nodo debe tener estas propiedades
✅ node.id (string, no vacío)
✅ node.type (string, no vacío)
✅ node.position (objeto con x e y numéricos)
✅ node.data (objeto, puede estar vacío)

// IDs únicos
✅ No puede haber dos nodos con el mismo ID

// Ejemplo de error
{
  "error": "Error de validación en la estructura del diagrama",
  "details": [
    "Nodo en índice 0: falta la propiedad 'id'",
    "Nodo en índice 1: ID duplicado 'node-1'"
  ]
}
```

### Validador de Edges

```javascript
// Cada edge debe tener
✅ edge.id (string, no vacío)
✅ edge.source (string, no vacío)
✅ edge.target (string, no vacío)

// Referencias válidas
✅ edge.source debe referenciar un nodo existente
✅ edge.target debe referenciar un nodo existente

// IDs únicos
✅ No puede haber dos edges con el mismo ID

// Ejemplo de error
{
  "error": "Error de validación en la estructura del diagrama",
  "details": [
    "Edge en índice 0: falta la propiedad 'source'",
    "Edge 'e2': el nodo source 'node-99' no existe",
    "Edge 'e3': el nodo target 'node-88' no existe"
  ]
}
```

### Endpoints de API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/diagrams` | Crear diagrama (valida estructura) |
| `PUT` | `/api/diagrams/:id` | Actualizar diagrama (valida estructura) |
| `GET` | `/api/diagrams` | Listar diagramas del usuario |
| `GET` | `/api/diagrams/:id` | Obtener diagrama específico |
| `DELETE` | `/api/diagrams/:id` | Eliminar diagrama |

Consulta [`backend/BossFlowHTTPRequestsInsomnia.yaml`](../backend/BossFlowHTTPRequestsInsomnia.yaml) para ejemplos de requests completos.

---

## Campos Automáticos

Al guardar un diagrama, el backend añade automáticamente:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f191e810c19729de860ea",
  "createdAt": "2025-11-27T12:00:00.000Z",
  "updatedAt": "2025-11-27T12:30:00.000Z",
  "title": "...",
  "description": "...",
  "nodes": [...],
  "edges": [...]
}
```

- `_id`: ID único del diagrama (ObjectId de MongoDB)
- `userId`: ID del usuario propietario
- `createdAt`: Timestamp de creación
- `updatedAt`: Timestamp de última actualización (se actualiza automáticamente)

---

## Referencias

- **Modelo Mongoose**: [`backend/models/Diagram.js`](../backend/models/Diagram.js)
- **Validadores**: [`backend/validators/diagramValidator.js`](../backend/validators/diagramValidator.js)
- **Controladores**: [`backend/controllers/diagramController.js`](../backend/controllers/diagramController.js)
- **Tipos de Nodos Personalizados**: [`docs/NODE_TYPES.md`](./NODE_TYPES.md)
- **React Flow Docs**: https://reactflow.dev/

---

**Última actualización**: 2025-11-27  
**Mantenedor**: Equipo BossFlow
