const Diagram = require('../models/Diagram');

exports.createDiagram = async (req, res, next) => {
    try {
        const { title, description, nodes, edges } = req.body;

        // Validar datos de entrada
        if (!title || title.trim().length < 3) {
            return res.status(400).json({ 
                error: 'El título es requerido y debe tener al menos 3 caracteres' 
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
        // Filtrar por userId y ordenar por fecha de actualización (más recientes primero)
        const diagrams = await Diagram.find({ userId: req.user.userId })
            .sort({ updatedAt: -1 });

        // Retornar lista de diagramas
        res.status(200).json({
            diagrams: diagrams.map(diagram => ({
                id: diagram._id,
                title: diagram.title,
                description: diagram.description,
                nodesCount: diagram.nodes?.length || 0,
                edgesCount: diagram.edges?.length || 0,
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
        const mongoose = require('mongoose');

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