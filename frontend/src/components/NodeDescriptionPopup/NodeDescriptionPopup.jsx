import { useEffect, useRef, useState } from 'react';
import './NodeDescriptionPopup.css';

/**
 * Componente popup que muestra la descripción e imagen de un nodo.
 * Se posiciona automáticamente cerca del nodo, ajustándose al espacio disponible.
 * Incluye soporte para dispositivos móviles y táctiles.
 *
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Indica si el popup está abierto
 * @param {Function} props.onClose - Función callback para cerrar el popup
 * @param {Object} props.node - Objeto del nodo con sus datos (título, descripción, imagen)
 * @param {Object} props.nodePosition - Objeto con la posición del nodo (top, left, bottom, width)
 * @returns {JSX.Element|null} Elemento popup o null si está cerrado o sin descripción
 */
const NodeDescriptionPopup = ({ isOpen, onClose, node, nodePosition }) => {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0, placement: 'top' });
  const [isVisible, setIsVisible] = useState(false);
  const isOpenRef = useRef(isOpen);
  const hoverTimeoutRef = useRef(null);
  const touchTimeoutRef = useRef(null);
  const isMobileRef = useRef(false);

  useEffect(() => {
    /**
     * Detecta si el dispositivo es móvil o táctil.
     *
     * @returns {boolean} true si es un dispositivo táctil, false en caso contrario
     */
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

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    /**
     * Maneja los clics fuera del popup para cerrarlo.
     * Inicia la animación de cierre antes de ejecutar el callback.
     *
     * @param {MouseEvent} e - Evento de clic del ratón
     */
    const handleClickOutside = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target) && isOpenRef.current) {
        setIsVisible(false);
        setTimeout(() => onClose(), 200);
      }
    };

    /**
     * Maneja la tecla Escape para cerrar el popup.
     *
     * @param {KeyboardEvent} e - Evento de teclado
     */
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpenRef.current) {
        setIsVisible(false);
        setTimeout(() => onClose(), 200);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !nodePosition || !tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const nodeRect = nodePosition;

    let top = nodeRect.top - tooltipRect.height - 12;
    let placement = 'top';

    if (top < 10) {
      top = nodeRect.bottom + 12;
      placement = 'bottom';
    }

    let left = nodeRect.left + nodeRect.width / 2 - tooltipRect.width / 2;

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

  if (!description || description.trim() === '') {
    return null;
  }

  /**
   * Maneja el evento cuando el ratón sale del popup (solo en escritorio).
   * Inicia un temporizador para cerrar el popup después de la animación.
   */
  const handleMouseLeave = () => {
    if (!isMobileRef.current) {
      setIsVisible(false);
      hoverTimeoutRef.current = setTimeout(() => onClose(), 200);
    }
  };

  /**
   * Maneja el evento cuando el ratón entra al popup (solo en escritorio).
   * Cancela el temporizador de cierre si existe y mantiene el popup visible.
   */
  const handleMouseEnter = () => {
    if (!isMobileRef.current && hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      setIsVisible(true);
    }
  };

  return (
    <aside
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
      <section className={`node-description-tooltip__content ${image ? 'has-image' : 'no-image'}`}>
        {image && (
          <figure className="node-description-tooltip__image-container">
            <img
              src={image.url}
              alt={image.filename || 'Imagen del nodo'}
              className="node-description-tooltip__image"
              loading="eager"
            />
          </figure>
        )}

        <article className="node-description-tooltip__text">
          <h4 className="node-description-tooltip__title">
            {node.data?.title || 'Nodo'}
          </h4>
          <p className="node-description-tooltip__description">
            {description}
          </p>
        </article>
      </section>

      <figure className={`node-description-tooltip__arrow node-description-tooltip__arrow--${position.placement}`} />
    </aside>
  );
};

export default NodeDescriptionPopup;
