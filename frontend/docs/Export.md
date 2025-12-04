# Funcionalidad de Exportación de Diagramas

## Descripción General

BossFlow incluye una funcionalidad de exportación que permite a los usuarios descargar sus diagramas en diferentes formatos para compartir, documentar o imprimir su trabajo.

## Formatos Disponibles

### PNG

El formato PNG permite exportar el diagrama como una imagen de alta calidad con fondo oscuro (#1a1a1a) que mantiene consistencia con el tema visual de la aplicación. Las dimensiones se calculan dinámicamente según el tamaño real del diagrama, añadiendo un padding de 20px alrededor del contenido para asegurar que todos los elementos sean visibles. Los archivos generados incluyen un timestamp en el nombre siguiendo el formato `{nombre-diagrama}_{YYYY-MM-DD}_{HH-MM}.png`, facilitando la organización y versión de las exportaciones. Este formato es especialmente útil para compartir diagramas en documentación técnica, presentaciones profesionales o publicaciones en redes sociales.

### PDF

La exportación a PDF genera documentos profesionales listos para distribución e impresión. El sistema detecta automáticamente la orientación más apropiada (horizontal o vertical) basándose en las dimensiones del diagrama, garantizando un aprovechamiento óptimo del espacio. El proceso de conversión utiliza una imagen PNG como base que posteriormente se integra en un documento PDF mediante la librería jsPDF, manteniendo la máxima calidad visual y precisión en las dimensiones. Este formato es ideal para documentación formal, impresión física en papel o distribución de archivos profesionales que requieren un estándar ampliamente compatible.

### SVG

**Estado**: Temporalmente deshabilitado

El formato SVG para gráficos vectoriales escalables se encuentra actualmente desactivado debido a problemas técnicos en el renderizado. Específicamente, la exportación no muestra correctamente el fondo y presenta dificultades en la captura completa de todos los nodos del diagrama. La función ha sido comentada en el código mediante un bloque de comentario multilínea y la variable exportToSVG se define como null para evitar errores en tiempo de ejecución. En la interfaz de usuario, el botón correspondiente aparece visualmente deshabilitado con la clase CSS `export-modal__option--disabled` y muestra el texto "(No disponible)" junto a un tooltip explicativo. La corrección de estos problemas técnicos está pendiente para futuras versiones.

## Implementación Técnica

### Arquitectura de Componentes

```
src/
├── hooks/
│   └── useExportDiagram.js      # Hook personalizado con lógica de exportación
├── components/
│   └── ExportModal/
│       ├── ExportModal.jsx      # Modal UI para selección de formato
│       └── ExportModal.css      # Estilos del modal
└── pages/
    └── Editor.jsx               # Integración en el editor principal
```

### Hook: useExportDiagram

Hook personalizado que encapsula toda la lógica de exportación de diagramas. Se encuentra en `src/hooks/useExportDiagram.js`.

**Parámetros**:
- `diagramName` (string, opcional): Nombre base para los archivos exportados. Por defecto: `'diagrama'`

Devuelve:
```javascript
{
  exportToPNG: async () => void,
  exportToSVG: null,  // Temporalmente deshabilitada
  exportToPDF: async () => void
}
```

**Funciones internas**:

**`generateFileName(extension)`**: Esta función se encarga de generar nombres de archivo únicos incluyendo un timestamp para evitar sobrescrituras. El formato resultante sigue el patrón `{nombre}_{YYYY-MM-DD}_{HH-MM}.{extension}`, donde la fecha y hora se obtienen del objeto Date de JavaScript, procesando la cadena ISO para extraer el día y el tiempo formateado.

**`downloadFile(dataUrl, fileName)`**: Maneja el proceso de descarga del archivo al navegador del usuario. Crea dinámicamente un elemento `<a>` temporal en el DOM, asigna los atributos necesarios para la descarga (download y href con la URL de datos), simula un clic programático para iniciar la descarga automática y finalmente elimina el elemento del documento.

**`getExportConfig()`**: Calcula las dimensiones exactas y la configuración del viewport necesarias para realizar la exportación correctamente. Utiliza la función `getNodesBounds()` de ReactFlow para obtener los límites del área que ocupan todos los nodos, añade un padding de 20px en los cuatro lados para crear un margen visual adecuado, y retorna un objeto con las propiedades width, height, viewport y nodesBounds que serán usadas por las funciones de exportación.

**`getViewportElement()`**: Obtiene la referencia al elemento DOM del viewport de ReactFlow mediante un selector CSS que busca la clase `.react-flow__viewport`. Valida que el elemento exista y sea visible en el documento, lanzando un error descriptivo si no se encuentra, lo cual garantiza que las funciones de exportación tengan acceso al contenido visual del diagrama.

**`exportToPNG()`**: Ejecuta el proceso completo de exportación a formato PNG, validando primero la existencia de nodos en el diagrama y obteniendo la configuración necesaria. Utiliza la librería `html-to-image` en su versión 1.11.11 (la última estable compatible) para convertir el elemento DOM del viewport en una imagen PNG, aplicando transformaciones CSS de posición y escala para asegurar que el contenido se capture correctamente con el fondo oscuro característico de la aplicación.

**`exportToPDF()`**: Realiza la exportación a formato PDF mediante un proceso de dos pasos que primero genera una imagen PNG del diagrama y posteriormente la convierte en un documento PDF usando la librería jsPDF. La función importa jsPDF de forma dinámica para evitar aumentar el tamaño del bundle principal, detecta automáticamente la orientación más apropiada (horizontal o vertical) comparando las dimensiones del diagrama, y crea un PDF con dimensiones exactas que coinciden con el contenido exportado.

### Componente: `ExportModal`

Modal de interfaz de usuario para seleccionar el formato de exportación. Se encuentra en `src/components/ExportModal/ExportModal.jsx`

**Propiedades**:
```javascript
{
  isOpen: boolean,           // Controla visibilidad del modal
  onClose: () => void,       // Callback para cerrar modal
  onExportPNG: () => void,   // Callback para exportar PNG
  onExportSVG: () => void,   // Callback para exportar SVG (deshabilitado)
  onExportPDF: () => void,   // Callback para exportar PDF
  isExporting: boolean       // Estado de carga durante exportación
}
```

### Integración en Editor

**Ubicación**: `src/pages/Editor.jsx`

El editor integra la funcionalidad mediante un botón flotante de exportación:

   ```jsx
   <button className="editor__floating-button--export">
     <FiDownload />
   </button>
   ```

Se ha creado un componente ExportHandler que envuelve el hook `useExportDiagram`. Este maneja notificaciones toast para éxito/error y registra actividad de exportación en el sistema

**Flujo de exportación**:
   1. Usuario hace clic en botón.
   2. Se abre ExportModal.
   3. Usuario selecciona formato.
   4. ExportHandler ejecuta exportación.
   5. Toast notifica resultado.
   6. Modal se cierra automáticamente.

## Dependencias

### Librerías Externas Utilizadas

1. **html-to-image** (v1.11.11)
   - Conversión de elementos DOM a imágenes
   - **IMPORTANTE**: Versión bloqueada en 1.11.11 por bugs en versiones superiores
   - Funciones usadas: `toPng()`, `toSvg()`
   - [Documentación](https://github.com/bubkoo/html-to-image)

2. **jsPDF**
   - Generación de documentos PDF
   - Importación dinámica para optimizar bundle
   - [Documentación](https://github.com/parallax/jsPDF)

3. **ReactFlow**
   - Hooks: `useReactFlow`, `getNodesBounds`, `getViewportForBounds`
   - Proporciona acceso a nodos y viewport del diagrama
   - [Documentación](https://reactflow.dev/)

### Instalación

```bash
npm install html-to-image@1.11.11 jspdf
```

## Configuración de Exportación

### Dimensiones Dinámicas

El sistema calcula automáticamente las dimensiones del diagrama:

```javascript
const nodesBounds = getNodesBounds(nodes);
const padding = 20;

const width = nodesBounds.width + padding * 2;
const height = nodesBounds.height + padding * 2;
```

### Viewport y Posicionamiento

Para centrar correctamente el contenido:

```javascript
const offsetX = nodesBounds.x - padding;
const offsetY = nodesBounds.y - padding;

const viewport = {
  x: -offsetX,
  y: -offsetY,
  zoom: 1
};
```

### Opciones de html-to-image

```javascript
{
  backgroundColor: '#1a1a1a',  // Fondo oscuro
  width: config.width,          // Ancho calculado
  height: config.height,        // Alto calculado
  style: {
    width: `${config.width}px`,
    height: `${config.height}px`,
    transform: `translate(${config.viewport.x}px, ${config.viewport.y}px) scale(${config.viewport.zoom})`,
  }
}
```

## Manejo de Errores

Se incluye manejo de errores en múltiples niveles:

1. **Validación de nodos**:
   ```javascript
   if (nodes.length === 0) {
     throw new Error('No hay nodos para exportar');
   }
   ```

2. **Validación de configuración**:
   ```javascript
   if (!config) {
     throw new Error('No se pudo calcular la configuración de exportación');
   }
   ```

3. **Validación de viewport**:
   ```javascript
   if (!viewport) {
     throw new Error('No se encontró el viewport de ReactFlow');
   }
   ```

4. **Notificaciones al usuario**:
   - Toast de error con mensaje descriptivo
   - Toast de éxito al completar exportación
   - Estado de carga durante el proceso

## Próximas Mejoras

- Implementar exportación JSON.


## Notas para Desarrolladores

### Importante para Mantenimiento

1. **No actualizar html-to-image**: La versión 1.11.11 es la última estable para ReactFlow. Versiones superiores tienen bugs.

2. **ReactFlowProvider requerido**: El hook `useExportDiagram` debe usarse dentro de un componente que esté envuelto por `ReactFlowProvider`.

3. **Importación dinámica de jsPDF**: Se usa `import()` dinámico para evitar aumentar el bundle principal.

4. **Cálculo de dimensiones**: El padding está hardcodeado en 20px. Considerar hacerlo configurable en futuras versiones.
