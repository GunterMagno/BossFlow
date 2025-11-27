const Diagram = require('../models/Diagram');
const User = require('../models/User');
const mongoose = require('mongoose');
const { validateDiagramStructure } = require('../validators/diagramValidator');

exports.createDiagram = async (req, res, next) => {
    try {
        const { title, description, nodes, edges } = req.body;

        // Validar datos de entrada
        if (!title || title.trim().length < 3) {
            return res.status(400).json({ 
                error: 'El título es requerido y debe tener al menos 3 caracteres' 
            });
        }

        // Validar estructura de nodos y edges
        const structureValidation = validateDiagramStructure({ nodes, edges });
        if (!structureValidation.valid) {
            return res.status(400).json({
                error: 'Error de validación en la estructura del diagrama',
                details: structureValidation.errors
            });
        }

        // Crear diagrama asociado al usuario autenticado
        const diagram = new Diagram({
            title: title.trim(),
            description: description?.trim() || '',
            userId: req.user.userId, // ID del usuario desde el middleware auth
            nodes: nodes || [],
            edges: edges || []
        });

        // Guardar en BD
        await diagram.save();

        // Actualizar estadísticas del usuario
        await User.findByIdAndUpdate(
            req.user.userId,
            {
                $inc: {
                    'stats.diagramsCreated': 1,
                    'stats.nodesCreated': (nodes || []).length
                }
            }
        );

        // Retornar diagrama creado
        res.status(201).json({
            message: 'Diagrama creado exitosamente',
            diagram: {
                id: diagram._id,
                title: diagram.title,
                description: diagram.description,
                nodes: diagram.nodes,
                edges: diagram.edges,
                createdAt: diagram.createdAt,
                updatedAt: diagram.updatedAt
            }
        });

    } catch (error) {
        // Manejar error de título duplicado
        if (error.code === 11000) {
            return res.status(409).json({ 
                error: 'Ya existe un diagrama con ese título' 
            });
        }

        // Manejar errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                error: error.message 
            });
        }

        // Otros errores
        console.error('❌ Error al crear diagrama:', error);
        next(error);
    }
};

exports.getDiagrams = async (req, res, next) => {
    try {
        // Obtener diagramas del usuario autenticado
        // Optimizaciones aplicadas:
        // 1. Usa índice compuesto { userId: 1, updatedAt: -1 }
        // 2. Proyección: solo campos necesarios (sin __v)
        // 3. lean(): devuelve objetos planos (más rápido que documentos Mongoose)
        const diagrams = await Diagram.find({ userId: req.user.userId })
            .select('title description nodes edges createdAt updatedAt') // Proyección
            .sort({ updatedAt: -1 })
            .lean();

        // Retornar lista de diagramas
        res.status(200).json({
            diagrams: diagrams.map(diagram => ({
                id: diagram._id,
                title: diagram.title,
                description: diagram.description,
                nodes: diagram.nodes || [],
                edges: diagram.edges || [],
                createdAt: diagram.createdAt,
                updatedAt: diagram.updatedAt
            }))
        });

    } catch (error) {
        console.error('❌ Error al obtener diagramas:', error);
        next(error);
    }
};

exports.deleteDiagram = async (req, res, next) => {
    try {
        const diagramId = req.params.id;

        // Validar que el ID sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(diagramId)) {
            return res.status(404).json({ 
                error: 'Diagrama no encontrado o no autorizado' 
            });
        }

        // Buscar y eliminar diagrama si pertenece al usuario autenticado
        const diagram = await Diagram.findOneAndDelete({ 
            _id: diagramId, 
            userId: req.user.userId 
        });

        if (!diagram) {
            return res.status(404).json({ 
                error: 'Diagrama no encontrado o no autorizado' 
            });
        }

        // Retornar respuesta de éxito
        res.status(200).json({ 
            message: 'Diagrama eliminado exitosamente' 
        });

    } catch (error) {
        console.error('❌ Error al eliminar diagrama:', error);
        next(error);
    }
};

exports.getDiagramById = async (req, res, next) => {
    try {
        const diagramId = req.params.id;

        // Validar que el ID sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(diagramId)) {
            return res.status(404).json({ 
                error: 'Diagrama no encontrado o no autorizado' 
            });
        }

        // Buscar diagrama por ID y userId
        const diagram = await Diagram.findOne({ 
            _id: diagramId, 
            userId: req.user.userId 
        })
        .select('title description nodes edges createdAt updatedAt')
        .lean();

        if (!diagram) {
            return res.status(404).json({ 
                error: 'Diagrama no encontrado o no autorizado' 
            });
        }

        // Retornar diagrama encontrado
        res.status(200).json({
            diagram: {
                id: diagram._id,
                title: diagram.title,
                description: diagram.description,
                nodes: diagram.nodes,
                edges: diagram.edges,
                createdAt: diagram.createdAt,
                updatedAt: diagram.updatedAt
            }
        });

    } catch (error) {
        console.error('❌ Error al obtener diagrama por ID:', error);
        next(error);
    }
};

exports.updateDiagram = async (req, res, next) => {
    try {
        const diagramId = req.params.id;
        const { title, description, nodes, edges } = req.body;
        
        // Validar que el ID sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(diagramId)) {
            return res.status(404).json({ 
                error: 'Diagrama no encontrado o no autorizado' 
            });
        }

        // Validar título si se proporciona
        if (title !== undefined && (!title || title.trim().length < 3)) {
            return res.status(400).json({ 
                error: 'El título debe tener al menos 3 caracteres' 
            });
        }

        // Validar estructura de nodos y edges si se proporcionan
        if (nodes !== undefined || edges !== undefined) {
            // Obtener el diagrama actual para combinar con los nuevos datos
            const currentDiagram = await Diagram.findOne({ 
                _id: diagramId, 
                userId: req.user.userId 
            });

            if (!currentDiagram) {
                return res.status(404).json({ 
                    error: 'Diagrama no encontrado o no autorizado' 
                });
            }

            const updatedNodes = nodes !== undefined ? nodes : currentDiagram.nodes;
            const updatedEdges = edges !== undefined ? edges : currentDiagram.edges;

            const structureValidation = validateDiagramStructure({ 
                nodes: updatedNodes, 
                edges: updatedEdges 
            });
            
            if (!structureValidation.valid) {
                return res.status(400).json({
                    error: 'Error de validación en la estructura del diagrama',
                    details: structureValidation.errors
                });
            }
        }

        // Buscar diagrama por ID y userId
        const diagram = await Diagram.findOne({ 
            _id: diagramId, 
            userId: req.user.userId 
        });

        if (!diagram) {
            return res.status(404).json({ 
                error: 'Diagrama no encontrado o no autorizado' 
            });
        }

        // Calcular cambio en número de nodos si se actualizan
        let nodeDifference = 0;
        if (nodes !== undefined) {
            const oldNodeCount = diagram.nodes.length;
            const newNodeCount = nodes.length;
            nodeDifference = newNodeCount - oldNodeCount;
        }

        // Actualizar campos del diagrama
        if (title !== undefined) diagram.title = title.trim();
        if (description !== undefined) diagram.description = description.trim();
        if (nodes !== undefined) diagram.nodes = nodes;
        if (edges !== undefined) diagram.edges = edges;

        // Guardar cambios
        await diagram.save();

        // Actualizar estadísticas del usuario si hay cambio en nodos
        if (nodeDifference !== 0) {
            await User.findByIdAndUpdate(
                req.user.userId,
                { $inc: { 'stats.nodesCreated': nodeDifference } }
            );
        }

        // Retornar diagrama actualizado
        res.status(200).json({
            message: 'Diagrama actualizado exitosamente',
            diagram: {
                id: diagram._id,
                title: diagram.title,
                description: diagram.description,
                nodes: diagram.nodes,
                edges: diagram.edges,
                createdAt: diagram.createdAt,
                updatedAt: diagram.updatedAt
            }
        });

    } catch (error) {
        // Manejar error de título duplicado
        if (error.code === 11000) {
            return res.status(409).json({ 
                error: 'Ya existe un diagrama con ese título' 
            });
        }

        // Manejar errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                error: error.message 
            });
        }

        console.error('❌ Error al actualizar diagrama:', error);
        next(error);
    }
};