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
