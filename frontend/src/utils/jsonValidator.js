/**
 * Utilities for validating the structure of diagram JSON files.
 */

/**
 * Current version of the JSON format.
 */
export const CURRENT_VERSION = '1.0.0';

/**
 * Compatible versions (for backwards compatibility).
 */
export const COMPATIBLE_VERSIONS = ['1.0.0'];

/**
 * Validates the complete structure of the imported JSON.
 * @param {Object} data - JSON data to validate.
 * @returns {Object} Object with properties valid (boolean) and errors (Array).
 */
export function validateJSONStructure(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['The file does not contain a valid JSON object'] };
  }

  if (!data.version) {
    errors.push('Missing "version" field');
  } else if (!COMPATIBLE_VERSIONS.includes(data.version)) {
    errors.push(`Incompatible version: ${data.version}. Compatible versions: ${COMPATIBLE_VERSIONS.join(', ')}`);
  }

  if (!data.metadata || typeof data.metadata !== 'object') {
    errors.push('Missing or invalid "metadata" field');
  } else {
    if (!data.metadata.title || typeof data.metadata.title !== 'string') {
      errors.push('metadata.title is required and must be text');
    }
    if (!data.metadata.exportedAt || typeof data.metadata.exportedAt !== 'string') {
      errors.push('metadata.exportedAt is required and must be text');
    }
  }

  if (!data.diagram || typeof data.diagram !== 'object') {
    errors.push('Missing or invalid "diagram" field');
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
 * Validates the array of nodes.
 * @param {Array} nodes - Array of nodes to validate.
 * @returns {Array} Array of errors found.
 */
function validateNodes(nodes) {
  const errors = [];

  if (!Array.isArray(nodes)) {
    errors.push('diagram.nodes must be an array');
    return errors;
  }

  nodes.forEach((node, index) => {
    if (!node.id || typeof node.id !== 'string') {
      errors.push(`Node ${index}: missing or invalid "id" field`);
    }
    if (!node.type || typeof node.type !== 'string') {
      errors.push(`Node ${index}: missing or invalid "type" field`);
    }
    if (!node.position || typeof node.position !== 'object') {
      errors.push(`Node ${index}: missing or invalid "position" field`);
    } else {
      if (typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
        errors.push(`Node ${index}: position.x and position.y must be numbers`);
      }
    }
    if (!node.data || typeof node.data !== 'object') {
      errors.push(`Node ${index}: missing or invalid "data" field`);
    }
  });

  return errors;
}

/**
 * Validates the array of connections (edges).
 * @param {Array} edges - Array of connections to validate.
 * @returns {Array} Array of errors found.
 */
function validateEdges(edges) {
  const errors = [];

  if (!Array.isArray(edges)) {
    errors.push('diagram.edges must be an array');
    return errors;
  }

  edges.forEach((edge, index) => {
    if (!edge.id || typeof edge.id !== 'string') {
      errors.push(`Connection ${index}: missing or invalid "id" field`);
    }
    if (!edge.source || typeof edge.source !== 'string') {
      errors.push(`Connection ${index}: missing or invalid "source" field`);
    }
    if (!edge.target || typeof edge.target !== 'string') {
      errors.push(`Connection ${index}: missing or invalid "target" field`);
    }
  });

  return errors;
}

/**
 * Verifies if the version is compatible.
 * @param {string} version - Version to verify
 * @returns {boolean}
 */
export function isVersionCompatible(version) {
  return COMPATIBLE_VERSIONS.includes(version);
}

/**
 * Validates that the file has the correct extension.
 * @param {string} filename - File name
 * @returns {boolean}
 */
export function isValidJSONFile(filename) {
  return filename && filename.endsWith('.json');
}
