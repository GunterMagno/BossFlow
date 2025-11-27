/**
 * Valida la estructura de un nodo
 * @param {Object} node - Nodo a validar
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateNode(node, index) {
    const errors = [];

    // Validar que el nodo existe
    if (!node || typeof node !== 'object') {
        return { 
            valid: false, 
            errors: [`Nodo en posición ${index}: debe ser un objeto válido`] 
        };
    }

    // Validar campo 'id' (obligatorio)
    if (!node.id || typeof node.id !== 'string' || node.id.trim() === '') {
        errors.push(`Nodo en posición ${index}: el campo 'id' es obligatorio y debe ser un string no vacío`);
    }

    // Validar campo 'type' (obligatorio)
    if (!node.type || typeof node.type !== 'string' || node.type.trim() === '') {
        errors.push(`Nodo en posición ${index}: el campo 'type' es obligatorio y debe ser un string no vacío`);
    }

    // Validar campo 'position' (obligatorio)
    if (!node.position || typeof node.position !== 'object') {
        errors.push(`Nodo en posición ${index}: el campo 'position' es obligatorio y debe ser un objeto`);
    } else {
        // Validar position.x
        if (typeof node.position.x !== 'number') {
            errors.push(`Nodo en posición ${index}: 'position.x' debe ser un número`);
        }

        // Validar position.y
        if (typeof node.position.y !== 'number') {
            errors.push(`Nodo en posición ${index}: 'position.y' debe ser un número`);
        }
    }

    // Validar campo 'data' (obligatorio, puede ser objeto vacío)
    if (node.data === undefined || node.data === null) {
        errors.push(`Nodo en posición ${index}: el campo 'data' es obligatorio (puede ser un objeto vacío {})`);
    } else if (typeof node.data !== 'object') {
        errors.push(`Nodo en posición ${index}: el campo 'data' debe ser un objeto`);
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Valida la estructura de un edge (conexión entre nodos)
 * @param {Object} edge - Edge a validar
 * @param {Array} nodes - Array de nodos para validar referencias
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateEdge(edge, index, nodes = []) {
    const errors = [];

    // Validar que el edge existe
    if (!edge || typeof edge !== 'object') {
        return { 
            valid: false, 
            errors: [`Edge en posición ${index}: debe ser un objeto válido`] 
        };
    }

    // Validar campo 'id' (obligatorio)
    if (!edge.id || typeof edge.id !== 'string' || edge.id.trim() === '') {
        errors.push(`Edge en posición ${index}: el campo 'id' es obligatorio y debe ser un string no vacío`);
    }

    // Validar campo 'source' (obligatorio)
    if (!edge.source || typeof edge.source !== 'string' || edge.source.trim() === '') {
        errors.push(`Edge en posición ${index}: el campo 'source' es obligatorio y debe ser un string no vacío`);
    } else if (nodes.length > 0) {
        // Validar que el nodo source existe
        const sourceExists = nodes.some(node => node.id === edge.source);
        if (!sourceExists) {
            errors.push(`Edge en posición ${index}: el nodo 'source' con id '${edge.source}' no existe`);
        }
    }

    // Validar campo 'target' (obligatorio)
    if (!edge.target || typeof edge.target !== 'string' || edge.target.trim() === '') {
        errors.push(`Edge en posición ${index}: el campo 'target' es obligatorio y debe ser un string no vacío`);
    } else if (nodes.length > 0) {
        // Validar que el nodo target existe
        const targetExists = nodes.some(node => node.id === edge.target);
        if (!targetExists) {
            errors.push(`Edge en posición ${index}: el nodo 'target' con id '${edge.target}' no existe`);
        }
    }

    // Validar que source y target son diferentes
    if (edge.source && edge.target && edge.source === edge.target) {
        errors.push(`Edge en posición ${index}: 'source' y 'target' no pueden ser el mismo nodo`);
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Valida el array completo de nodos
 * @param {Array} nodes - Array de nodos a validar
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateNodes(nodes) {
    if (!Array.isArray(nodes)) {
        return {
            valid: false,
            errors: ['El campo "nodes" debe ser un array']
        };
    }

    // Validar IDs únicos
    const nodeIds = nodes.map(n => n?.id).filter(Boolean);
    const duplicateIds = nodeIds.filter((id, index) => nodeIds.indexOf(id) !== index);
    
    if (duplicateIds.length > 0) {
        return {
            valid: false,
            errors: [`IDs de nodos duplicados: ${[...new Set(duplicateIds)].join(', ')}`]
        };
    }

    // Validar cada nodo individualmente
    const allErrors = [];
    nodes.forEach((node, index) => {
        const validation = validateNode(node, index);
        if (!validation.valid) {
            allErrors.push(...validation.errors);
        }
    });

    return {
        valid: allErrors.length === 0,
        errors: allErrors
    };
}

/**
 * Valida el array completo de edges
 * @param {Array} edges - Array de edges a validar
 * @param {Array} nodes - Array de nodos para validar referencias
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateEdges(edges, nodes = []) {
    if (!Array.isArray(edges)) {
        return {
            valid: false,
            errors: ['El campo "edges" debe ser un array']
        };
    }

    // Validar IDs únicos
    const edgeIds = edges.map(e => e?.id).filter(Boolean);
    const duplicateIds = edgeIds.filter((id, index) => edgeIds.indexOf(id) !== index);
    
    if (duplicateIds.length > 0) {
        return {
            valid: false,
            errors: [`IDs de edges duplicados: ${[...new Set(duplicateIds)].join(', ')}`]
        };
    }

    // Validar cada edge individualmente
    const allErrors = [];
    edges.forEach((edge, index) => {
        const validation = validateEdge(edge, index, nodes);
        if (!validation.valid) {
            allErrors.push(...validation.errors);
        }
    });

    return {
        valid: allErrors.length === 0,
        errors: allErrors
    };
}

/**
 * Valida la estructura completa del diagrama (nodos + edges)
 * @param {Object} diagramData - Datos del diagrama { nodes, edges }
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateDiagramStructure(diagramData) {
    const { nodes = [], edges = [] } = diagramData;
    const allErrors = [];

    // Validar nodos
    const nodesValidation = validateNodes(nodes);
    if (!nodesValidation.valid) {
        allErrors.push(...nodesValidation.errors);
    }

    // Validar edges (solo si los nodos son válidos para evitar errores en cascada)
    if (nodesValidation.valid) {
        const edgesValidation = validateEdges(edges, nodes);
        if (!edgesValidation.valid) {
            allErrors.push(...edgesValidation.errors);
        }
    } else {
        // Si los nodos no son válidos, validar edges sin referencias
        const edgesValidation = validateEdges(edges, []);
        if (!edgesValidation.valid) {
            allErrors.push(...edgesValidation.errors);
        }
    }

    return {
        valid: allErrors.length === 0,
        errors: allErrors
    };
}

module.exports = {
    validateNode,
    validateEdge,
    validateNodes,
    validateEdges,
    validateDiagramStructure
};
