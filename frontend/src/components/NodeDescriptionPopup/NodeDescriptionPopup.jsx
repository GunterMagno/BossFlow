import { useEffect, useRef, useState } from 'react';
import './NodeDescriptionPopup.css';

const NodeDescriptionPopup = ({ isOpen, onClose, node, nodePosition }) => {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0, placement: 'top' });
  const [isVisible, setIsVisible] = useState(false);
  const isOpenRef = useRef(isOpen);
  const hoverTimeoutRef = useRef(null);
  const touchTimeoutRef = useRef(null);
  const isMobileRef = useRef(false);

  // Detectar si es mobile/touch device
  useEffect(() => {
    const isMobile = () => {
      return (
        typeof window !== 'undefined' &&
        (navigator.maxTouchPoints > 0 ||
          navigator.msMaxTouchPoints > 0 ||
          (window.matchMedia && window.matchMedia('(hover: none)').matches))
      );
    };
    isMobileRef.current = isMobile();
  }, []);

  // Actualizar ref cuando isOpen cambia
  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  // Cerrar con clic fuera (en cualquier parte del documento)
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      // No cerrar si el clic es dentro del tooltip o si no está abierto
      if (tooltipRef.current && !tooltipRef.current.contains(e.target) && isOpenRef.current) {
        // Iniciar animación de cierre
        setIsVisible(false);
        // Después de la animación, cerrar completamente
        setTimeout(() => onClose(), 200);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpenRef.current) {
        setIsVisible(false);
        setTimeout(() => onClose(), 200);
      }
    };

    // Usar capture phase para que funcione correctamente
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Calcular posición del tooltip
  useEffect(() => {
    if (!isOpen || !nodePosition || !tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const nodeRect = nodePosition;

    // Intentar posicionar arriba
    let top = nodeRect.top - tooltipRect.height - 12; // 12px de margen
    let placement = 'top';

    // Si no hay espacio arriba, poner abajo
    if (top < 10) {
      top = nodeRect.bottom + 12;
      placement = 'bottom';
    }

    // Centrar horizontalmente respecto al nodo
    let left = nodeRect.left + nodeRect.width / 2 - tooltipRect.width / 2;

    // Asegurar que no se salga de los bordes
    const padding = 16;
    if (left < padding) left = padding;
    if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding;
    }

    setPosition({ top, left, placement });
  }, [isOpen, nodePosition]);

  if (!isOpen || !node) return null;

  const description = node.data?.description;
  const image = node.data?.image;

  // No renderizar si no hay descripción
  if (!description || description.trim() === '') {
    return null;
  }

  // Handler para mouse leave (solo en desktop/hover)
  const handleMouseLeave = () => {
    if (!isMobileRef.current) {
      setIsVisible(false);
      hoverTimeoutRef.current = setTimeout(() => onClose(), 200);
    }
  };

  // Handler para mouse enter (solo en desktop/hover)
  const handleMouseEnter = () => {
    if (!isMobileRef.current && hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      setIsVisible(true);
    }
  };

  return (
    <div
      ref={tooltipRef}
      className={`node-description-tooltip node-description-tooltip--${position.placement} ${isVisible ? 'is-visible' : ''}`}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 1000,
        pointerEvents: 'auto',
      }}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div className={`node-description-tooltip__content ${image ? 'has-image' : 'no-image'}`}>
        {/* Imagen a la derecha (si existe) */}
        {image && (
          <div className="node-description-tooltip__image-container">
            <img
              src={image.url}
              alt={image.filename || 'Imagen del nodo'}
              className="node-description-tooltip__image"
              loading="eager"
            />
          </div>
        )}

        {/* Descripción a la izquierda o centrada */}
        <div className="node-description-tooltip__text">
          <h4 className="node-description-tooltip__title">
            {node.data?.title || 'Nodo'}
          </h4>
          <p className="node-description-tooltip__description">
            {description}
          </p>
        </div>
      </div>

      {/* Triángulo/flecha hacia el nodo */}
      <div className={`node-description-tooltip__arrow node-description-tooltip__arrow--${position.placement}`} />
    </div>
  );
};

export default NodeDescriptionPopup;
