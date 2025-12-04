# Sistema de Plantillas

## Descripción
Hemos implementado un sistema completo de plantillas predeterminadas embebidas en el frontend y gestión de plantillas personalizadas del usuario, sin modificar el schema del modelo Diagram.

## Arquitectura

### Plantillas del Sistema
Hemos creado 8 plantillas predeterminadas que se cargan directamente desde el frontend:
- **Ubicación:** `frontend/src/data/defaultTemplates.js`
- **Almacenamiento:** Embebidas en el bundle JS (no requieren MongoDB)
- **IDs:** Utilizamos prefijo `system-` para evitar colisiones con ObjectId de MongoDB
- **Carga:** Instantánea sin llamadas al backend

### Plantillas de Usuario
Hemos modificado el modelo Diagram en MongoDB con campo `isTemplate: true` y los endpoints existentes de diagrams con filtro `isTemplate`.

## Componentes Implementados

### Templates.jsx
Hemos creado la página principal con sistema de pestañas para separar plantillas predeterminadas de las personalizadas:

```jsx
const [activeTab, setActiveTab] = useState('predeterminadas');

// Pestañas
{activeTab === 'predeterminadas' && (
  <TemplateList templates={DEFAULT_TEMPLATES} isSystemTemplate={true} />
)}
{activeTab === 'mis-plantillas' && (
  <TemplateList templates={userTemplates} isSystemTemplate={false} />
)}
```

### TemplateCard.jsx
Hemos diseñado cards con botones contextuales según el tipo de plantilla:

```jsx
// Botones según tipo de plantilla
{!isSystemTemplate && (
  <button className="template-card__delete-button">
    <FiTrash2 />
  </button>
)}

// Acciones principales
<button onClick={() => onUseTemplate(template)}>Usar</button>
{isSystemTemplate && <button onClick={() => onCopyTemplate(template)}>Copiar</button>}
{!isSystemTemplate && <button onClick={() => onEditTemplate(template)}>Editar</button>}
```

### NewTemplateModal.jsx
Hemos creado a partir del modal existente NewDiagramModal, para hacerlo para las plantillas y poder soportar tanto creación como edición:

```jsx
function NewTemplateModal({ editingTemplateId, initialTitle, initialNodes, initialEdges }) {
  // Si editingTemplateId existe → modo edición
  // Si es null → modo creación
  
  const handleSubmit = async () => {
    if (editingTemplateId) {
      await updateDiagram(editingTemplateId, data);
    } else {
      await createDiagram({ ...data, isTemplate: true });
    }
  };
}
```

## Plantillas Predeterminadas

Hemos creado 8 plantillas del sistema con diferentes estrategias de combate.

### Ejemplo de Plantilla realizada
```javascript
{
    id: "system-estrategia-basica",
    title: "Estrategia básica",
    description: "Plantilla fundamental para planificar cualquier enfrentamiento. Incluye preparación, ejecución y evaluación.",
    isTemplate: true,
    nodes: [
      {
        id: "preparacion-inicial",
        type: "start",
        position: { x: 250, y: 50 },
        data: { title: "Preparación Inicial" }
      },
      {
        id: "analisis-enemigo",
        type: "decision",
        position: { x: 250, y: 180 },
        data: { title: "Análisis del Enemigo" }
      },
      {
        id: "ejecutar-estrategia",
        type: "action",
        position: { x: 250, y: 310 },
        data: { title: "Ejecutar Estrategia" }
      },
      {
        id: "ajustar-tactica",
        type: "action",
        position: { x: 250, y: 440 },
        data: { title: "Ajustar Táctica" }
      },
      {
        id: "victoria",
        type: "end",
        position: { x: 250, y: 570 },
        data: { title: "Victoria" }
      }
    ],
    edges: [
      { 
        id: "edge-prep-analisis",
        source: "preparacion-inicial",
        target: "analisis-enemigo",
        sourceHandle: "preparacion-inicial-bottom-source",
        targetHandle: "analisis-enemigo-top-target",
        type: "default"
      },
      { 
        id: "edge-analisis-ejecutar",
        source: "analisis-enemigo",
        target: "ejecutar-estrategia",
        sourceHandle: "analisis-enemigo-bottom-source",
        targetHandle: "ejecutar-estrategia-top-target",
        type: "default"
      },
      { 
        id: "edge-ejecutar-ajustar",
        source: "ejecutar-estrategia",
        target: "ajustar-tactica",
        sourceHandle: "ejecutar-estrategia-bottom-source",
        targetHandle: "ajustar-tactica-top-target",
        type: "default"
      },
      { 
        id: "edge-ajustar-victoria",
        source: "ajustar-tactica",
        target: "victoria",
        sourceHandle: "ajustar-tactica-bottom-source",
        targetHandle: "victoria-top-target",
        type: "default"
      }
    ]
  }
```

## Funcionalidades Implementadas

### Usar Plantilla (Predeterminada)
Hemos implementado la creación de nuevos diagramas desde plantillas:

```javascript
const handleUseTemplate = (template) => {
  setTemplateNodes({ nodes: template.nodes, edges: template.edges });
  setIsModalOpen(true); // Abre NewDiagramModal
};
```

### Copiar Plantilla (Predeterminada)
Hemos añadido la funcionalidad de copiar una plantilla predeterminada como plantilla personalizada y modificarla:

```javascript
const handleCopyTemplate = (template) => {
  setInitialTitle(`Copia de ${template.title}`);
  setInitialNodes(template.nodes);
  setInitialEdges(template.edges);
  setIsTemplateModalOpen(true);
};
```

### Editar Plantilla (Usuario)
Hemos implementado la edición de plantillas personalizadas mediante un modal para poder modificar la info de la plantilla y luego dirige al editor:

```javascript
const handleEditTemplate = (template) => {
  setEditingTemplateId(template.id);
  setInitialTitle(template.title);
  // Modal actualiza título/descripción, luego navega al editor
};
```

### Eliminar Plantilla (Usuario)
Hemos añadido la confirmación antes de eliminar plantilla personalizada:

```javascript
const handleDeleteTemplate = (template) => {
  setTemplateToDelete(template);
  // ConfirmModal → handleConfirmDelete → deleteTemplate(id)
};
```

## Mejoras de UI

Hemos actualizado y añadido estilos para mantener consistencia y coherencia visual:
- Mantenemos los colores utilizados en la página de diagramas.
- Posicionamos los botones en el final de la card y el botón eliminar a la esquina superior derecha.
- Actualizamos ConfirmModal para usar color amarillo en el botón principal.
- Refactorizamos clases CSS.


## Navegación

Hemos integrado y protegido la ruta de plantillas en la navegación del dashboard:

```jsx
// Sidebar Dashboard
<Link to="/dashboard/plantillas">
  <FiLayers /> Plantillas
</Link>

// Ruta protegida
<Route path="/dashboard/plantillas" element={
  <PrivateRoute><Templates /></PrivateRoute>
} />
```

## Cambios en el Backend

### Modelo Diagram (models/Diagram.js)

Hemos añadido el campo `isTemplate` al schema existente sin modificar la estructura base con valor "false" por defecto:

```javascript
const DiagramSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, minLength: 3 },
    description: { type: String, required: false, trim: true, maxLength: 500 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isTemplate: { type: Boolean, default: false }, // Campo añadido
    nodes: [{ /* estructura existente */ }],
    edges: [{ /* estructura existente */ }]
}, { timestamps: true });
```

### Controlador Diagram (controllers/diagramController.js)

Hemos implementado funcionalidad para gestionar plantillas mediante `isTemplate`:

**createDiagram:**
- Acepta campo `isTemplate` desde el body
- Crea diagramas normales (`isTemplate: false`) o plantillas (`isTemplate: true`)
- Actualiza estadísticas del usuario (`nodesCreated`, `diagramsCreated`)

```javascript
const diagram = new Diagram({
    title: title.trim(),
    description: description?.trim() || '',
    userId: req.user.userId,
    nodes: nodes || [],
    edges: edges || [],
    isTemplate: isTemplate || false // Soporte para plantillas
});
```

**getDiagrams:**
- Filtra solo diagramas (`isTemplate: { $ne: true }`)
- Excluye plantillas de la lista de diagramas del usuario

```javascript
const diagrams = await Diagram.find({ 
    userId: req.user.userId,
    isTemplate: { $ne: true } // Solo diagramas normales
})
```

**getTemplates (AÑADIDO):**
- Endpoint específico para obtener plantillas del usuario
- Filtra por `isTemplate: true`
- Devuelve solo plantillas personalizadas creadas por el usuario

```javascript
exports.getTemplates = async (req, res, next) => {
    try {
        const templates = await Diagram.find({ 
            userId: req.user.userId,
            isTemplate: true // Solo plantillas
        })
            .select('title description nodes edges createdAt updatedAt isTemplate')
            .sort({ updatedAt: -1 })
            .lean();
        
        res.status(200).json({
            templates: templates.map(template => ({
                id: template._id,
                title: template.title,
                description: template.description,
                nodes: template.nodes || [],
                edges: template.edges || [],
                createdAt: template.createdAt,
                updatedAt: template.updatedAt,
                isTemplate: template.isTemplate
            }))
        });
    } catch (error) {
        console.error('❌ Error al obtener plantillas:', error);
        next(error);
    }
};
```

**updateDiagram:**
- Permite actualizar tanto diagramas como plantillas
- Mantiene la validación de estructura de nodos/edges
- No requiere cambios específicos para plantillas

**deleteDiagram:**
- Elimina tanto diagramas como plantillas
- Verifica que el recurso pertenezca al usuario (`userId`)

### Rutas (routes/index.js)

Hemos añadido la ruta específica para obtener plantillas:

```javascript
// Nueva ruta para plantillas
router.get("/templates", auth, (req, res, next) => {
  diagramController.getTemplates(req, res, next);
});

// Rutas existentes reutilizadas
router.post("/diagrams", auth, diagramController.createDiagram);
router.put("/diagrams/:id", auth, diagramController.updateDiagram);
router.delete("/diagrams/:id", auth, diagramController.deleteDiagram);
```

### Servicio Frontend (services/diagramService.js)

Hemos añadido dos nuevas funciones al servicio:

**getTemplates:**
```javascript
export const getTemplates = async () => {
  const response = await api.get('/api/templates');
  return response.data;
};
```

**deleteTemplate:**
```javascript
export const deleteTemplate = async (id) => {
  const response = await api.delete(`/api/diagrams/${id}`);
  return response.data;
};
```
Y modficado: 

**createDiagram (modificado):**
- Acepta campo `isTemplate` en el payload
- Permite crear tanto diagramas como plantillas

```javascript
export const createDiagram = async (diagramData) => {
  const response = await api.post('/api/diagrams', {
    title: diagramData.title,
    description: diagramData.description,
    nodes: diagramData.nodes || [],
    edges: diagramData.edges || [],
    isTemplate: diagramData.isTemplate || false // Soporte plantillas
  });
  return response.data;
};
```

### Modal NewTemplateModal

Hemos creado el modal para plantillas a partir de la del diagrama para soportar tanto creación como edición:

**Propiedades añadidas:**
- `editingTemplateId`: ID de la plantilla a editar (null = crear)
- `initialTitle`, `initialDescription`, `initialNodes`, `initialEdges`: Datos precargados de las plantillas

Ejemplo:
```javascript
const handleSubmit = async () => {
  if (editingTemplateId) {
    // Modo edición: actualiza plantilla existente
    await updateDiagram(editingTemplateId, {
      title, description, nodes, edges
    });
  } else {
    // Modo creación: crea nueva plantilla
    await createDiagram({
      title, description, nodes, edges,
      isTemplate: true
    });
  }
};
```