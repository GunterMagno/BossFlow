import { useState, useEffect, useCallback } from 'react';

const CLAVE_ALMACENAMIENTO = 'bossflow_recent_nodes';
const MAXIMO_NODOS_RECIENTES = 5;

/**
 * Hook para gestionar nodos recientes
 * Almacena y recupera los últimos nodos utilizados en el editor
 * 
 * @returns {Object} { nodosRecientes, agregarNodoReciente, limpiarNodosRecientes }
 */
const useRecentNodes = () => {
  const [nodosRecientes, setNodosRecientes] = useState([]);

  useEffect(() => {
    try {
      const almacenado = localStorage.getItem(CLAVE_ALMACENAMIENTO);
      if (almacenado) {
        const parseado = JSON.parse(almacenado);
        setNodosRecientes(Array.isArray(parseado) ? parseado : []);
      }
    } catch (error) {
      console.error('Error al cargar nodos recientes:', error);
      setNodosRecientes([]);
    }
  }, []);

  /**
   * Añade un nodo a la lista de recientes
   * Evita duplicados y mantiene un límite máximo
   * 
   * @param {Object} datosNodo - Datos del nodo (type, label, description, color)
   */
  const agregarNodoReciente = useCallback((datosNodo) => {
    if (!datosNodo || !datosNodo.type) {
      console.warn('agregarNodoReciente: datosNodo inválido', datosNodo);
      return;
    }

    setNodosRecientes((previos) => {
      const filtrados = previos.filter((nodo) => nodo.type !== datosNodo.type);
      
      const actualizados = [
        {
          type: datosNodo.type,
          label: datosNodo.label,
          description: datosNodo.description,
          color: datosNodo.color,
          timestamp: Date.now()
        },
        ...filtrados
      ].slice(0, MAXIMO_NODOS_RECIENTES);

      try {
        localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(actualizados));
      } catch (error) {
        console.error('Error al guardar nodos recientes:', error);
      }

      return actualizados;
    });
  }, []);

  /**
   * Limpia todos los nodos recientes
   */
  const limpiarNodosRecientes = useCallback(() => {
    setNodosRecientes([]);
    try {
      localStorage.removeItem(CLAVE_ALMACENAMIENTO);
    } catch (error) {
      console.error('Error al limpiar nodos recientes:', error);
    }
  }, []);

  return {
    nodosRecientes,
    agregarNodoReciente,
    limpiarNodosRecientes
  };
};

export default useRecentNodes;
