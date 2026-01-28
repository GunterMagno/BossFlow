import { useEffect, useRef, useState } from 'react';
import './NodeDescriptionPopup.css';

/**
 * Popup component that displays a node's description and image.
 * Automatically positions itself near the node, adjusting to available space.
 * Includes support for mobile and touch devices.
 *
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Whether the popup is open
 * @param {Function} props.onClose - Callback function to close the popup
 * @param {Object} props.node - Node object with its data (title, description, image)
 * @param {Object} props.nodePosition - Object with node position (top, left, bottom, width)
 * @returns {JSX.Element|null} Popup element or null if closed or without description
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
     * Detects if the device is mobile or touch-enabled.
     *
     * @returns {boolean} true if it's a touch device, false otherwise
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
     * Handles clicks outside the popup to close it.
     * Starts the closing animation before executing the callback.
     *
     * @param {MouseEvent} e - Mouse click event
     */
    const handleClickOutside = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target) && isOpenRef.current) {
        setIsVisible(false);
        setTimeout(() => onClose(), 200);
      }
    };

    /**
     * Handles the Escape key to close the popup.
     *
     * @param {KeyboardEvent} e - Keyboard event
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
   * Handles the event when the mouse leaves the popup (desktop only).
   * Starts a timer to close the popup after the animation.
   */
  const handleMouseLeave = () => {
    if (!isMobileRef.current) {
      setIsVisible(false);
      hoverTimeoutRef.current = setTimeout(() => onClose(), 200);
    }
  };

  /**
   * Handles the event when the mouse enters the popup (desktop only).
   * Cancels the closing timer if it exists and keeps the popup visible.
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
