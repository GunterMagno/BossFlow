import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'bossflow_recent_nodes';
const MAX_RECENT_NODES = 5;

/**
 * Hook for managing recent nodes.
 * Stores and retrieves the last nodes used in the editor.
 * 
 * @returns {Object} { recentNodes, addRecentNode, clearRecentNodes }
 */
const useRecentNodes = () => {
  const [recentNodes, setRecentNodes] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentNodes(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading recent nodes:', error);
      setRecentNodes([]);
    }
  }, []);

  /**
   * Adds a node to the recent list.
   * Avoids duplicates and maintains a maximum limit.
   * 
   * @param {Object} nodeData - Node data (type, label, description, color)
   */
  const addRecentNode = useCallback((nodeData) => {
    if (!nodeData || !nodeData.type) {
      console.warn('addRecentNode: invalid nodeData', nodeData);
      return;
    }

    setRecentNodes((previous) => {
      const filtered = previous.filter((node) => node.type !== nodeData.type);
      
      const updated = [
        {
          type: nodeData.type,
          label: nodeData.label,
          description: nodeData.description,
          color: nodeData.color,
          timestamp: Date.now()
        },
        ...filtered
      ].slice(0, MAX_RECENT_NODES);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving recent nodes:', error);
      }

      return updated;
    });
  }, []);

  /**
   * Clears all recent nodes.
   */
  const clearRecentNodes = useCallback(() => {
    setRecentNodes([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing recent nodes:', error);
    }
  }, []);

  return {
    recentNodes,
    addRecentNode,
    clearRecentNodes
  };
};

export default useRecentNodes;
