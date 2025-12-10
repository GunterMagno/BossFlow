/**
 * Utilidades para validar la estructura de archivos JSON de diagramas.
 */

/**
 * Versión actual del formato JSON.
 */
export const CURRENT_VERSION = '1.0.0';

/**
 * Versiones compatibles (para retrocompatibilidad).
 */
export const COMPATIBLE_VERSIONS = ['1.0.0'];

/**
 * Valida la estructura completa del JSON importado.
 * @param {Object} data - Datos JSON a validar.
 * @returns {Object} Objeto con propiedades valid (boolean) y errors (Array).
 */
export function validateJSONStructure(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['El archivo no contiene un objeto JSON válido'] };
  }

  if (!data.version) {
    errors.push('Falta el campo "version"');
  } else if (!COMPATIBLE_VERSIONS.includes(data.version)) {
    errors.push(`Versión incompatible: ${data.version}. Versiones compatibles: ${COMPATIBLE_VERSIONS.join(', ')}`);
  }

  if (!data.metadata || typeof data.metadata !== 'object') {
    errors.push('Falta o es inválido el campo "metadata"');
  } else {
    if (!data.metadata.title || typeof data.metadata.title !== 'string') {
      errors.push('metadata.title es requerido y debe ser texto');
    }
    if (!data.metadata.exportedAt || typeof data.metadata.exportedAt !== 'string') {
      errors.push('metadata.exportedAt es requerido y debe ser texto');
    }
  }

  if (!data.diagram || typeof data.diagram !== 'object') {
    errors.push('Falta o es inválido el campo "diagram"');
  } else {
    const nodeErrors = validateNodes(data.diagram.nodes);
    errors.push(...nodeErrors);

    const edgeErrors = validateEdges(data.diagram.edges);
    errors.push(...edgeErrors);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Valida el array de nodos.
 * @param {Array} nodes - Array de nodos a validar.
 * @returns {Array} Array de errores encontrados.
 */
function validateNodes(nodes) {
  const errors = [];

  if (!Array.isArray(nodes)) {
    errors.push('diagram.nodes debe ser un array');
    return errors;
  }

  nodes.forEach((node, index) => {
    if (!node.id || typeof node.id !== 'string') {
      errors.push(`Nodo ${index}: falta o es inválido el campo "id"`);
    }
    if (!node.type || typeof node.type !== 'string') {
      errors.push(`Nodo ${index}: falta o es inválido el campo "type"`);
    }
    if (!node.position || typeof node.position !== 'object') {
      errors.push(`Nodo ${index}: falta o es inválido el campo "position"`);
    } else {
      if (typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
        errors.push(`Nodo ${index}: position.x y position.y deben ser números`);
      }
    }
    if (!node.data || typeof node.data !== 'object') {
      errors.push(`Nodo ${index}: falta o es inválido el campo "data"`);
    }
  });

  return errors;
}

/**
 * Valida el array de conexiones (edges).
 * @param {Array} edges - Array de conexiones a validar.
 * @returns {Array} Array de errores encontrados.
 */
function validateEdges(edges) {
  const errors = [];

  if (!Array.isArray(edges)) {
    errors.push('diagram.edges debe ser un array');
    return errors;
  }

  edges.forEach((edge, index) => {
    if (!edge.id || typeof edge.id !== 'string') {
      errors.push(`Conexión ${index}: falta o es inválido el campo "id"`);
    }
    if (!edge.source || typeof edge.source !== 'string') {
      errors.push(`Conexión ${index}: falta o es inválido el campo "source"`);
    }
    if (!edge.target || typeof edge.target !== 'string') {
      errors.push(`Conexión ${index}: falta o es inválido el campo "target"`);
    }
  });

  return errors;
}

/**
 * Se verifica si la versión es compatible.
 * @param {string} version - Versión a verificar
 * @returns {boolean}
 */
export function isVersionCompatible(version) {
  return COMPATIBLE_VERSIONS.includes(version);
}

/**
 * Se valida que el archivo tenga la extensión correcta.
 * @param {string} filename - Nombre del archivo
 * @returns {boolean}
 */
export function isValidJSONFile(filename) {
  return filename && filename.endsWith('.json');
}
