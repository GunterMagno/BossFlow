# Tipos de Nodos - BossFlow

Documento de especificación de tipos de nodos para el editor de diagramas de BossFlow.

**Fecha de creación**: 2025-11-24
**Sprint**: 4 - Punto 1
**Versión**: 1.0

---

## Índice

1. [Introducción](#introducción)
2. [Tipo: Acción](#tipo-acción)
3. [Tipo: Decisión](#tipo-decisión)
4. [Tipo: Inicio/Fin](#tipo-iniciofin)
5. [Tipo: Fase de Boss](#tipo-fase-de-boss)
6. [Resumen de Propiedades](#resumen-de-propiedades)

---

## Introducción

BossFlow utiliza un sistema de nodos tipados para representar diferentes elementos en los diagramas de flujo de combate. Cada tipo de nodo tiene propiedades específicas, estilos visuales únicos y comportamientos definidos.

### Convenciones Generales

Todos los nodos comparten estas propiedades base:

- **id**: Identificador único del nodo (string)
- **type**: Tipo de nodo (string)
- **position**: Posición en el canvas `{ x: number, y: number }`
- **data**: Objeto con datos específicos del nodo

---

## Tipo: Acción

### Descripción

Representa una **acción concreta** que el jefe o jugador debe realizar durante el combate. Las acciones son pasos ejecutables que tienen un resultado directo.

### Propiedades

```javascript
{
  id: string,             
  type: "action",          
  position: { x, y },      
  data: {
    title: string,        
    icon: string,          
    description: string,
    damage: number,        
    cooldown: number,      
    targetType: string,    
  }
}
```

### Características Visuales

- **Forma**: Rectángulo redondeado
- **Color**: Verde (`#33cc33`)
- **Handles**: Conectores en los 4 lados (top, right, bottom, left)
- **Iconos sugeridos**: ⚔️ 🔥 💥 🛡️ 🏹 ⚡

### Casos de Uso

- Ataques del jefe
- Habilidades especiales
- Acciones defensivas
- Buffs/debuffs
- Invocaciones

### Ejemplo

```javascript
{
  id: "action-1",
  type: "action",
  position: { x: 100, y: 200 },
  data: {
    title: "Aliento de Dragón",
    icon: "🔥",
    description: "El dragón lanza un poderoso aliento de fuego",
    damage: 150,
    cooldown: 10,
    targetType: "aoe"
  }
}
```

---

## Tipo: Decisión

### Descripción

Representa un **punto de bifurcación** en el flujo donde se evalúa una condición. El flujo puede tomar diferentes caminos según el resultado de la evaluación.

### Propiedades

```javascript
{
  id: string,             
  type: "decision",        
  position: { x, y },     
  data: {
    title: string,         
    icon: string,          
    description: string,  
    condition: string,     
    trueLabel: string,     
    falseLabel: string,    
  }
}
```

### Características Visuales

- **Forma**: Rombo/Diamante
- **Color**: Azul claro (`#4da6ff`)
- **Handles**: Conectores en los 4 lados
- **Iconos sugeridos**: ❓ 🔀 ⚖️ 🎲 🔍

### Casos de Uso

- Evaluación de vida del jefe
- Comprobación de fase de combate
- Verificación de buffs/debuffs activos
- Detección de mecánicas especiales
- Condiciones de enrage

### Ejemplo

```javascript
{
  id: "decision-1",
  type: "decision",
  position: { x: 250, y: 150 },
  data: {
    title: "¿Vida < 30%?",
    icon: "❓",
    description: "Evalúa si la vida del jefe está por debajo del 30%",
    condition: "boss.health < 0.3",
    trueLabel: "Sí - Fase Enrage",
    falseLabel: "No - Continuar"
  }
}
```

---

## Tipo: Inicio/Fin

### Descripción

Representa los **puntos de entrada y salida** del diagrama de flujo. Marca el comienzo del combate y los posibles finales (victoria/derrota).

### Propiedades

```javascript
{
  id: string,              
  type: "startEnd",        
  position: { x, y },      
  data: {
    title: string,         
    icon: string,          
    description: string,   
    nodeSubtype: string,   
    endCondition: string,  
  }
}
```

### Características Visuales

- **Forma**: Círculo o elipse
- **Color**:
  - Inicio: Gris claro (`#888888`)
  - Victoria: Verde brillante (`#00ff00`)
  - Derrota: Rojo (`#ff0000`)
- **Handles**:
  - Inicio: Solo salidas (source)
  - Fin: Solo entradas (target)
- **Iconos sugeridos**:
  - Inicio: ▶️ 🎬 🚀
  - Victoria: ✅ 🏆 ⭐
  - Derrota: ❌ 💀 ⚰️

### Casos de Uso

- Punto de inicio del combate
- Condición de victoria (jefe derrotado)
- Condición de derrota (party wipe)
- Escape exitoso
- Timeout del combate

### Ejemplo

```javascript
// Nodo de Inicio
{
  id: "start-1",
  type: "startEnd",
  position: { x: 50, y: 50 },
  data: {
    title: "Inicio del Combate",
    icon: "▶️",
    description: "El combate comienza",
    nodeSubtype: "start"
  }
}

// Nodo de Fin (Victoria)
{
  id: "end-victory",
  type: "startEnd",
  position: { x: 800, y: 300 },
  data: {
    title: "Victoria",
    icon: "✅",
    description: "El jefe ha sido derrotado",
    nodeSubtype: "end",
    endCondition: "boss.health <= 0"
  }
}
```

---

## Tipo: Fase de Boss

### Descripción

Representa una **fase importante** del combate del jefe. Las fases suelen activarse al alcanzar ciertos umbrales de vida o después de eventos específicos, cambiando significativamente las mecánicas del combate.

### Propiedades

```javascript
{
  id: string,             
  type: "phase",          
  position: { x, y },     
  data: {
    title: string,         
    icon: string,          
    description: string, 
    phaseNumber: number,   
    triggerCondition: string,
    healthThreshold: number,  
    newMechanics: string[],   
    phaseColor: string,       
  }
}
```

### Características Visuales

- **Forma**: Hexágono o rectángulo con bordes gruesos
- **Color**: Amarillo dorado (`#ffcc00`)
- **Handles**: Conectores en los 4 lados
- **Iconos sugeridos**: 👑 ⚡ 🌟 💀 🔱 ⚔️
- **Estilo especial**: Borde más grueso y brillante para destacar

### Casos de Uso

- Transición de fase por vida
- Cambio de mecánicas de combate
- Invocación de adds
- Cambios de escenario
- Activación de enrage
- Fases intermitentes (intermission)

### Ejemplo

```javascript
{
  id: "phase-2",
  type: "phase",
  position: { x: 400, y: 200 },
  data: {
    title: "Fase 2: Furia del Dragón",
    icon: "👑",
    description: "El dragón enfurece y gana nuevas habilidades",
    phaseNumber: 2,
    triggerCondition: "boss.health <= 50%",
    healthThreshold: 50,
    newMechanics: [
      "Aliento de fuego doble",
      "Invocación de whelps",
      "Vuelo aéreo"
    ],
    phaseColor: "#ff6600"
  }
}
```

---

## Resumen de Propiedades

### Tabla Comparativa

| Propiedad | Acción | Decisión | Inicio/Fin | Fase de Boss |
|-----------|--------|----------|------------|--------------|
| **Forma visual** | Rectángulo | Rombo | Círculo/Elipse | Hexágono |
| **Color** | Verde (`#33cc33`) | Azul (`#4da6ff`) | Gris/Verde/Rojo | Amarillo (`#ffcc00`) |
| **Handles** | 4 lados (I/O) | 4 lados (I/O) | Solo I o solo O | 4 lados (I/O) |
| **Propósito** | Ejecutar acción | Evaluar condición | Marcar inicio/fin | Cambio de fase |
| **Conectividad** | Múltiple | Bifurcación (2+) | Única | Múltiple |

### Propiedades Comunes

Todas las propiedades `data` comunes a todos los tipos:

```javascript
{
  title: string,        
  icon: string,         
  description: string, 
}
```

### Propiedades Específicas por Tipo

#### Acción
- `damage`: number
- `cooldown`: number
- `targetType`: "single" | "aoe" | "self"

#### Decisión
- `condition`: string
- `trueLabel`: string
- `falseLabel`: string

#### Inicio/Fin
- `nodeSubtype`: "start" | "end"
- `endCondition`: string

#### Fase de Boss
- `phaseNumber`: number
- `triggerCondition`: string
- `healthThreshold`: number
- `newMechanics`: string[]
- `phaseColor`: string

---

## Implementación Técnica

### Estructura de Código

Los nodos están implementados en:
- **Componentes**: `frontend/src/components/nodes/Nodes.jsx`
- **Registro de tipos**: `frontend/src/components/FlowMap/FlowMap.jsx` (línea 17)

### Tipos Actuales vs Requeridos

**Actualmente implementados:**
- ✅ `action` - ActionNode
- ✅ `decision` - DecisionNode
- ✅ `phase` - PhaseNode
- ⚠️ `effect` - EffectNode (puede ser renombrado/eliminado)

**Por implementar:**
- ❌ `startEnd` - Nodo de Inicio/Fin (combinar start y end)

### Migración Necesaria

1. **Crear `StartEndNode`** - Nuevo componente para inicio/fin
2. **Actualizar tipos** en `tiposNodos` del FlowMap
3. **Revisar `EffectNode`** - Decidir si mantener o integrar en otro tipo

---

## Notas de Diseño

### Accesibilidad
- Todos los nodos usan colores diferenciados
- Los iconos proporcionan contexto visual adicional
- Los handles son suficientemente grandes (12px) para fácil interacción

### UX
- Los colores siguen la psicología de colores:
  - Verde = Acción positiva/ejecutar
  - Azul = Pensamiento/decisión
  - Amarillo = Importante/fase crítica
  - Verde brillante = Éxito
  - Rojo = Peligro/fin negativo

### Extensibilidad
El sistema de tipos es extensible. Para añadir nuevos tipos:
1. Crear componente en `Nodes.jsx`
2. Registrar en `tiposNodos` en `FlowMap.jsx`
3. Documentar en este archivo

---

## Changelog

### v1.0 - 2025-11-24
- Definición inicial de los 4 tipos de nodos principales
- Documentación completa de propiedades
- Especificación visual y casos de uso
- Tabla comparativa de tipos
