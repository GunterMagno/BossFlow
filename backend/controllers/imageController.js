const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Directorio donde se guardarán las imágenes
const UPLOAD_DIR = path.join(__dirname, '../uploads/images');

// Crear directorio si no existe
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Subir imagen desde archivo o base64
 */
exports.uploadImage = async (req, res, next) => {
    try {
        const { image, filename, mimeType } = req.body;

        // Validar que se envió una imagen
        if (!image) {
            return res.status(400).json({ 
                error: 'No se proporcionó ninguna imagen' 
            });
        }

        // Validar tipo MIME
        const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!mimeType || !validMimeTypes.includes(mimeType)) {
            return res.status(400).json({ 
                error: 'Tipo de imagen no válido. Use: jpeg, png, gif o webp' 
            });
        }

        // Decodificar base64
        let base64Data;
        if (image.includes('base64,')) {
            base64Data = image.split('base64,')[1];
        } else {
            base64Data = image;
        }

        const buffer = Buffer.from(base64Data, 'base64');
        const size = buffer.length;

        // Validar tamaño (máximo 5MB)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (size > MAX_SIZE) {
            return res.status(400).json({ 
                error: 'La imagen excede el tamaño máximo de 5MB' 
            });
        }

        // Generar nombre único para el archivo
        const extension = mimeType.split('/')[1];
        const uniqueName = `${crypto.randomBytes(16).toString('hex')}.${extension}`;
        const filePath = path.join(UPLOAD_DIR, uniqueName);

        // Guardar archivo
        fs.writeFileSync(filePath, buffer);

        // Construir URL de la imagen
        const imageUrl = `/uploads/images/${uniqueName}`;

        // Retornar metadata de la imagen
        res.status(201).json({
            message: 'Imagen subida exitosamente',
            image: {
                filename: filename || uniqueName,
                url: imageUrl,
                mimeType: mimeType,
                size: size,
                createdAt: new Date()
            }
        });

    } catch (error) {
        console.error('❌ Error al subir imagen:', error);
        next(error);
    }
};

/**
 * Validar URL de imagen externa
 */
exports.validateImageUrl = async (req, res, next) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ 
                error: 'No se proporcionó ninguna URL' 
            });
        }

        // Validar formato de URL
        try {
            new URL(url);
        } catch (e) {
            return res.status(400).json({ 
                error: 'URL no válida' 
            });
        }

        // Verificar que la URL apunta a una imagen
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const hasImageExtension = imageExtensions.some(ext => 
            url.toLowerCase().includes(ext)
        );

        if (!hasImageExtension) {
            return res.status(400).json({ 
                error: 'La URL no parece apuntar a una imagen válida' 
            });
        }

        // Determinar mimeType basado en extensión
        let mimeType = 'image/jpeg';
        if (url.includes('.png')) mimeType = 'image/png';
        else if (url.includes('.gif')) mimeType = 'image/gif';
        else if (url.includes('.webp')) mimeType = 'image/webp';

        // Retornar metadata
        res.status(200).json({
            message: 'URL validada exitosamente',
            image: {
                filename: url.split('/').pop() || 'image',
                url: url,
                mimeType: mimeType,
                size: 0, // No conocemos el tamaño de imágenes externas
                createdAt: new Date()
            }
        });

    } catch (error) {
        console.error('❌ Error al validar URL:', error);
        next(error);
    }
};

/**
 * Eliminar imagen del servidor
 */
exports.deleteImage = async (req, res, next) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ 
                error: 'No se proporcionó ninguna URL' 
            });
        }

        // Solo eliminar si es una imagen local
        if (url.startsWith('/uploads/images/')) {
            const filename = url.split('/').pop();
            const filePath = path.join(UPLOAD_DIR, filename);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return res.status(200).json({ 
                    message: 'Imagen eliminada exitosamente' 
                });
            }
        }

        res.status(200).json({ 
            message: 'Imagen referenciada eliminada (URL externa)' 
        });

    } catch (error) {
        console.error('❌ Error al eliminar imagen:', error);
        next(error);
    }
};
