/**
 * Validates image metadata.
 * @param {Object} image - Image metadata to validate.
 * @param {string} image.filename - File name.
 * @param {string} image.url - Image URL.
 * @param {string} image.mimeType - MIME type (jpeg, png, gif, webp).
 * @param {number} image.size - Size in bytes (maximum 5MB).
 * @param {string} context - Context for error messages.
 * @returns {Object} Object with properties valid (boolean) and errors (array of strings).
 */
function validateImageMetadata(image, context) {
  const errors = [];
  const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  // Validate that the image is an object
  if (!image || typeof image !== "object") {
    return {
      valid: false,
      errors: [`${context}: must be a valid object`],
    };
  }

  // Validate filename (required)
  if (
    !image.filename ||
    typeof image.filename !== "string" ||
    image.filename.trim() === ""
  ) {
    errors.push(
      `${context}: the 'filename' field is required and must be a non-empty string`
    );
  }

  // Validate url (required)
  if (!image.url || typeof image.url !== "string" || image.url.trim() === "") {
    errors.push(
      `${context}: the 'url' field is required and must be a non-empty string`
    );
  }

  // Validate mimeType (required)
  if (!image.mimeType || typeof image.mimeType !== "string") {
    errors.push(
      `${context}: the 'mimeType' field is required and must be a string`
    );
  } else if (!ALLOWED_MIME_TYPES.includes(image.mimeType)) {
    errors.push(
      `${context}: 'mimeType' must be one of: ${ALLOWED_MIME_TYPES.join(", ")}`
    );
  }

  // Validate size (required)
  if (typeof image.size !== "number") {
    errors.push(
      `${context}: the 'size' field is required and must be a number`
    );
  } else if (image.size < 0) {
    errors.push(`${context}: 'size' must be greater than or equal to 0`);
  } else if (image.size > MAX_SIZE) {
    errors.push(`${context}: 'size' cannot exceed ${MAX_SIZE} bytes (5MB)`);
  }

  // Validate createdAt (optional)
  if (
    image.createdAt !== undefined &&
    !(image.createdAt instanceof Date) &&
    isNaN(Date.parse(image.createdAt))
  ) {
    errors.push(`${context}: 'createdAt' must be a valid date`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates the structure of a diagram node.
 * @param {Object} node - Node to validate.
 * @param {string} node.id - Unique node ID.
 * @param {string} node.type - Node type.
 * @param {Object} node.position - Node position {x, y}.
 * @param {Object} node.data - Node data.
 * @param {number} index - Index of the node in the array.
 * @returns {Object} Object with properties valid (boolean) and errors (array of strings).
 */
function validateNode(node, index) {
  const errors = [];

  // Validate that the node exists
  if (!node || typeof node !== "object") {
    return {
      valid: false,
      errors: [`Node at position ${index}: must be a valid object`],
    };
  }

  // Validate 'id' field (required)
  if (!node.id || typeof node.id !== "string" || node.id.trim() === "") {
    errors.push(
      `Node at position ${index}: the 'id' field is required and must be a non-empty string`
    );
  }

  // Validate 'type' field (required)
  if (!node.type || typeof node.type !== "string" || node.type.trim() === "") {
    errors.push(
      `Node at position ${index}: the 'type' field is required and must be a non-empty string`
    );
  }

  // Validate 'position' field (required)
  if (!node.position || typeof node.position !== "object") {
    errors.push(
      `Node at position ${index}: the 'position' field is required and must be an object`
    );
  } else {
    // Validate position.x
      if (typeof node.position.x !== "number") {
      errors.push(`Node at position ${index}: 'position.x' must be a number`);
    }

    // Validate position.y
    if (typeof node.position.y !== "number") {
      errors.push(`Node at position ${index}: 'position.y' must be a number`);
    }
  }

  // Validate 'data' field (required, can be empty object)
  if (node.data === undefined || node.data === null) {
    errors.push(
      `Node at position ${index}: the 'data' field is required (may be an empty object {})`
    );
  } else if (typeof node.data !== "object") {
    errors.push(
      `Node at position ${index}: the 'data' field must be an object`
    );
  }

  // Validate 'image' field
  if (node.image !== undefined && node.image !== null) {
    const imageValidation = validateImageMetadata(
      node.image,
      `Node at position ${index}, 'image' field`
    );
    if (!imageValidation.valid) {
      errors.push(...imageValidation.errors);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates the structure of an edge (connection between nodes).
 * @param {Object} edge - Edge to validate.
 * @param {Array} nodes - Array of nodes to validate references.
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateEdge(edge, index, nodes = []) {
  const errors = [];

  // Validate that the edge exists
  if (!edge || typeof edge !== "object") {
    return {
      valid: false,
      errors: [`Edge at position ${index}: must be a valid object`],
    };
  }

  // Validate 'id' field (required)
  if (!edge.id || typeof edge.id !== "string" || edge.id.trim() === "") {
    errors.push(
      `Edge at position ${index}: the 'id' field is required and must be a non-empty string`
    );
  }

  // Validate 'source' field (required)
  if (
    !edge.source ||
    typeof edge.source !== "string" ||
    edge.source.trim() === ""
  ) {
    errors.push(
      `Edge at position ${index}: the 'source' field is required and must be a non-empty string`
    );
  } else if (nodes.length > 0) {
    // Validate that the source node exists
    const sourceExists = nodes.some((node) => node.id === edge.source);
    if (!sourceExists) {
      errors.push(
        `Edge at position ${index}: source node with id '${edge.source}' does not exist`
      );
    }
  }

  // Validate 'target' field (required)
  if (
    !edge.target ||
    typeof edge.target !== "string" ||
    edge.target.trim() === ""
  ) {
    errors.push(
      `Edge at position ${index}: the 'target' field is required and must be a non-empty string`
    );
  } else if (nodes.length > 0) {
    // Validate that the target node exists
    const targetExists = nodes.some((node) => node.id === edge.target);
    if (!targetExists) {
      errors.push(
        `Edge at position ${index}: target node with id '${edge.target}' does not exist`
      );
    }
  }

  // Validate that source and target are different
  if (edge.source && edge.target && edge.source === edge.target) {
    errors.push(
      `Edge at position ${index}: 'source' and 'target' cannot be the same node`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates the full array of nodes.
 * @param {Array} nodes - Array of nodes to validate.
 * @returns {Object} Object with properties valid (boolean) and errors (array of strings).
 */
function validateNodes(nodes) {
  if (!Array.isArray(nodes)) {
    return {
      valid: false,
      errors: ['The "nodes" field must be an array'],
    };
  }

  // Validate unique IDs
  const nodeIds = nodes.map((n) => n?.id).filter(Boolean);
  const duplicateIds = nodeIds.filter(
    (id, index) => nodeIds.indexOf(id) !== index
  );

  if (duplicateIds.length > 0) {
    return {
      valid: false,
      errors: [
        `Duplicate node IDs: ${[...new Set(duplicateIds)].join(", ")}`,
      ],
    };
  }

  // Validate each node individually
  const allErrors = [];
  nodes.forEach((node, index) => {
    const validation = validateNode(node, index);
    if (!validation.valid) {
      allErrors.push(...validation.errors);
    }
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  };
}

/**
 * Validates the full array of connections (edges).
 * @param {Array} edges - Array of edges to validate.
 * @param {Array} nodes - Array of nodes to validate references.
 * @returns {Object} Object with properties valid (boolean) and errors (array of strings).
 */
function validateEdges(edges, nodes = []) {
  if (!Array.isArray(edges)) {
    return {
      valid: false,
      errors: ['The "edges" field must be an array'],
    };
  }

  // Validate unique IDs
  const edgeIds = edges.map((e) => e?.id).filter(Boolean);
  const duplicateIds = edgeIds.filter(
    (id, index) => edgeIds.indexOf(id) !== index
  );

  if (duplicateIds.length > 0) {
    return {
      valid: false,
      errors: [
        `Duplicate edge IDs: ${[...new Set(duplicateIds)].join(", ")}`,
      ],
    };
  }

  // Validate each edge individually
  const allErrors = [];
  edges.forEach((edge, index) => {
    const validation = validateEdge(edge, index, nodes);
    if (!validation.valid) {
      allErrors.push(...validation.errors);
    }
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  };
}

/**
 * Validates the complete diagram structure (nodes, edges and images).
 * @param {Object} diagramData - Diagram data.
 * @param {Array} diagramData.nodes - Array of nodes (optional, default []).
 * @param {Array} diagramData.edges - Array of edges (optional, default []).
 * @param {Array} diagramData.images - Array of images (optional, default []).
 * @returns {Object} Object with properties valid (boolean) and errors (array of strings).
 */
function validateDiagramStructure(diagramData) {
  const { nodes = [], edges = [], images = [] } = diagramData;
  const allErrors = [];
  const MAX_IMAGES = 10;

  // Validate diagram images
  if (!Array.isArray(images)) {
    allErrors.push('The "images" field must be an array');
  } else {
    if (images.length > MAX_IMAGES) {
      allErrors.push(
        `A diagram cannot have more than ${MAX_IMAGES} images`
      );
    }

    images.forEach((image, index) => {
      const imageValidation = validateImageMetadata(
        image,
        `Diagram image at position ${index}`
      );
      if (!imageValidation.valid) {
        allErrors.push(...imageValidation.errors);
      }
    });
  }

  // Validate nodes
  const nodesValidation = validateNodes(nodes);
  if (!nodesValidation.valid) {
    allErrors.push(...nodesValidation.errors);
  }

  // Validate edges (only if nodes are valid to avoid cascading errors)
  if (nodesValidation.valid) {
    const edgesValidation = validateEdges(edges, nodes);
    if (!edgesValidation.valid) {
      allErrors.push(...edgesValidation.errors);
    }
  } else {
    // If nodes are not valid, validate edges without references
    const edgesValidation = validateEdges(edges, []);
    if (!edgesValidation.valid) {
      allErrors.push(...edgesValidation.errors);
    }
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  };
}

module.exports = {
  validateImageMetadata,
  validateNode,
  validateEdge,
  validateNodes,
  validateEdges,
  validateDiagramStructure,
};
