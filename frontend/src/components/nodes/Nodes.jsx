import React from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import "./Nodes.css";
import {
  FiZap,
  FiGitBranch,
  FiCircle,
  FiWatch,
  FiTool,
  FiMapPin,
  FiClock,
  FiStar,
} from 'react-icons/fi';

const posiciones = [
  { pos: Position.Top, name: "top" },
  { pos: Position.Right, name: "right" },
  { pos: Position.Bottom, name: "bottom" },
  { pos: Position.Left, name: "left" },
];

/**
 * Componente que renderiza los puntos de conexión (handles) de un nodo.
 * Crea handles de entrada y salida en las cuatro posiciones (arriba, derecha, abajo, izquierda).
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.nodeId - ID del nodo para garantizar handles únicos
 * @param {string} props.color - Color del fondo de los handles según el tipo de nodo
 * @returns {JSX.Element} Conjunto de handles para el nodo
 */
const Handles = ({ nodeId = '', color = 'var(--handle-default)' }) => (
  <>
    {posiciones.map(({ pos, name }) => (
      <React.Fragment key={name}>
        <Handle
          id={`${nodeId}-${name}-target`}
          type="target"
          position={pos}
          isConnectable={true}
          style={{ width: 12, height: 12, borderRadius: 6, zIndex: 10, background: color }}
        />
        <Handle
          id={`${nodeId}-${name}-source`}
          type="source"
          position={pos}
          isConnectable={true}
          style={{ width: 12, height: 12, borderRadius: 6, background: color, zIndex: 10 }}
        />
      </React.Fragment>
    ))}
  </>
);

/**
 * Componente simple para mostrar el título de un nodo.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.value - Texto del título a mostrar
 * @returns {JSX.Element} Elemento span con el título del nodo
 */
const NodeTitle = ({ value }) => {
  return <span className="node-title">{value}</span>;
};

/**
 * Componente de nodo de tipo decisión.
 * Representa un punto de bifurcación o decisión en el flujo del diagrama.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - ID único del nodo
 * @param {Object} props.data - Datos del nodo (título, descripción, etc.)
 * @param {Object} props.style - Estilos CSS aplicados al nodo
 * @param {boolean} props.selected - Indica si el nodo está seleccionado
 * @returns {JSX.Element} Elemento de nodo de decisión
 */
export const DecisionNode = ({ id, data, style, selected }) => (
  <article className={`node decision-node ${selected ? 'selected' : ''}`} style={style}>
    <NodeResizer minWidth={100} minHeight={30} isVisible={selected} handleStyle={{
      width: '8px',
      height: '8px',
      backgroundColor: selected ? 'var(--node-decision)' : 'transparent',
      border: '1px solid white',
      borderRadius: '2px',
    }} />
    <Handles nodeId={id} color={'var(--node-decision)'} />
    <span className="icon"><FiGitBranch className="node-icon icon-decision" role="img" aria-label="Icono de decisión" /></span>
    <NodeTitle value={data.title} />
  </article>
);

/**
 * Componente de nodo de tipo acción.
 * Representa una acción o actividad en el flujo del diagrama.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - ID único del nodo
 * @param {Object} props.data - Datos del nodo (título, descripción, etc.)
 * @param {Object} props.style - Estilos CSS aplicados al nodo
 * @param {boolean} props.selected - Indica si el nodo está seleccionado
 * @returns {JSX.Element} Elemento de nodo de acción
 */
export const ActionNode = ({ id, data, style, selected }) => (
  <article className={`node action-node ${selected ? 'selected' : ''}`} style={style}>
    <NodeResizer minWidth={100} minHeight={30} isVisible={selected} handleStyle={{
      width: '8px',
      height: '8px',
      backgroundColor: selected ? 'var(--node-action)' : 'transparent',
      border: '1px solid white',
      borderRadius: '2px',
    }} />
    <Handles nodeId={id} color={'var(--node-action)'} />
    <span className="icon"><FiZap className="node-icon icon-action" role="img" aria-label="Icono de acción" /></span>
    <NodeTitle value={data.title} />
  </article>
);

/**
 * Componente de nodo de tipo fase.
 * Representa una fase o etapa del proceso en el diagrama.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - ID único del nodo
 * @param {Object} props.data - Datos del nodo (título, descripción, etc.)
 * @param {Object} props.style - Estilos CSS aplicados al nodo
 * @param {boolean} props.selected - Indica si el nodo está seleccionado
 * @returns {JSX.Element} Elemento de nodo de fase
 */
export const PhaseNode = ({ id, data, style, selected }) => (
  <article className={`node phase-node ${selected ? 'selected' : ''}`} style={style}>
    <NodeResizer minWidth={100} minHeight={30} isVisible={selected} handleStyle={{
      width: '8px',
      height: '8px',
      backgroundColor: selected ? 'var(--node-phase)' : 'transparent',
      border: '1px solid white',
      borderRadius: '2px',
    }} />
    <Handles nodeId={id} color={'var(--node-phase)'} />
    <span className="icon"><FiWatch className="node-icon icon-phase" role="img" aria-label="Icono de fase" /></span>
    <NodeTitle value={data.title} />
  </article>
);

/**
 * Componente de nodo de tipo efecto o mecánica.
 * Representa un efecto o mecánica del sistema en el diagrama.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - ID único del nodo
 * @param {Object} props.data - Datos del nodo (título, descripción, etc.)
 * @param {Object} props.style - Estilos CSS aplicados al nodo
 * @param {boolean} props.selected - Indica si el nodo está seleccionado
 * @returns {JSX.Element} Elemento de nodo de efecto
 */
export const EffectNode = ({ id, data, style, selected }) => (
  <article className={`node effect-node ${selected ? 'selected' : ''}`} style={style}>
    <NodeResizer minWidth={100} minHeight={30} isVisible={selected} handleStyle={{
      width: '8px',
      height: '8px',
      backgroundColor: selected ? 'var(--node-effect)' : 'transparent',
      border: '1px solid white',
      borderRadius: '2px',
    }} />
    <Handles nodeId={id} color={'var(--node-effect)'} />
    <span className="icon"><FiTool className="node-icon icon-effect" role="img" aria-label="Icono de mecánica" /></span>
    <NodeTitle value={data.title} />
  </article>
);

/**
 * Componente de nodo de inicio.
 * Representa el punto de inicio de un flujo en el diagrama.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - ID único del nodo
 * @param {Object} props.data - Datos del nodo (título, descripción, etc.)
 * @param {Object} props.style - Estilos CSS aplicados al nodo
 * @param {boolean} props.selected - Indica si el nodo está seleccionado
 * @returns {JSX.Element} Elemento de nodo de inicio
 */
export const StartNode = ({ id, data, style, selected }) => (
  <article className={`node start-node ${selected ? 'selected' : ''}`} style={style}>
    <NodeResizer minWidth={80} minHeight={30} isVisible={selected} handleStyle={{
      width: '8px',
      height: '8px',
      backgroundColor: selected ? 'var(--node-start-end)' : 'transparent',
      border: '1px solid white',
      borderRadius: '2px',
    }} />
    <Handles nodeId={id} color={'var(--node-start-end)'} />
    <span className="icon"><FiCircle className="node-icon icon-start-end" role="img" aria-label="Icono de evento" /></span>
    <NodeTitle value={data?.title || 'Start'} />
  </article>
);

/**
 * Componente de nodo de fin.
 * Representa el punto de finalización de un flujo en el diagrama.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - ID único del nodo
 * @param {Object} props.data - Datos del nodo (título, descripción, etc.)
 * @param {Object} props.style - Estilos CSS aplicados al nodo
 * @param {boolean} props.selected - Indica si el nodo está seleccionado
 * @returns {JSX.Element} Elemento de nodo de fin
 */
export const EndNode = ({ id, data, style, selected }) => (
  <article className={`node end-node ${selected ? 'selected' : ''}`} style={style}>
    <NodeResizer minWidth={80} minHeight={30} isVisible={selected} handleStyle={{
      width: '8px',
      height: '8px',
      backgroundColor: selected ? 'var(--node-start-end)' : 'transparent',
      border: '1px solid white',
      borderRadius: '2px',
    }} />
    <Handles nodeId={id} color={'var(--node-start-end)'} />
    <span className="icon"><FiCircle className="node-icon icon-start-end" role="img" aria-label="Icono de evento" /></span>
    <NodeTitle value={data?.title || 'End'} />
  </article>
);

/**
 * Componente de nodo de tipo posición.
 * Representa una posición o ubicación específica en el diagrama.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - ID único del nodo
 * @param {Object} props.data - Datos del nodo (título, descripción, etc.)
 * @param {Object} props.style - Estilos CSS aplicados al nodo
 * @param {boolean} props.selected - Indica si el nodo está seleccionado
 * @returns {JSX.Element} Elemento de nodo de posición
 */
export const PositionNode = ({ id, data, style, selected }) => (
  <article className={`node position-node ${selected ? 'selected' : ''}`} style={style}>
    <NodeResizer minWidth={100} minHeight={30} isVisible={selected} handleStyle={{
      width: '8px',
      height: '8px',
      backgroundColor: selected ? 'var(--node-position)' : 'transparent',
      border: '1px solid white',
      borderRadius: '2px',
    }} />
    <Handles nodeId={id} color={'var(--node-position)'} />
    <span className="icon"><FiMapPin className="node-icon icon-position" role="img" aria-label="Icono de posición" /></span>
    <NodeTitle value={data.title} />
  </article>
);

/**
 * Componente de nodo de tipo temporizador.
 * Representa un temporizador o contador de tiempo en el diagrama.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - ID único del nodo
 * @param {Object} props.data - Datos del nodo (título, descripción, etc.)
 * @param {Object} props.style - Estilos CSS aplicados al nodo
 * @param {boolean} props.selected - Indica si el nodo está seleccionado
 * @returns {JSX.Element} Elemento de nodo de temporizador
 */
export const TimerNode = ({ id, data, style, selected }) => (
  <article className={`node timer-node ${selected ? 'selected' : ''}`} style={style}>
    <NodeResizer minWidth={100} minHeight={30} isVisible={selected} handleStyle={{
      width: '8px',
      height: '8px',
      backgroundColor: selected ? 'var(--node-timer)' : 'transparent',
      border: '1px solid white',
      borderRadius: '2px',
    }} />
    <Handles nodeId={id} color={'var(--node-timer)'} />
    <span className="icon"><FiClock className="node-icon icon-timer" role="img" aria-label="Icono de temporizador" /></span>
    <NodeTitle value={data.title} />
  </article>
);

/**
 * Componente de nodo de tipo habilidad.
 * Representa una habilidad o capacidad especial en el diagrama.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - ID único del nodo
 * @param {Object} props.data - Datos del nodo (título, descripción, etc.)
 * @param {Object} props.style - Estilos CSS aplicados al nodo
 * @param {boolean} props.selected - Indica si el nodo está seleccionado
 * @returns {JSX.Element} Elemento de nodo de habilidad
 */
export const AbilityNode = ({ id, data, style, selected }) => (
  <article className={`node ability-node ${selected ? 'selected' : ''}`} style={style}>
    <NodeResizer minWidth={100} minHeight={30} isVisible={selected} handleStyle={{
      width: '8px',
      height: '8px',
      backgroundColor: selected ? 'var(--node-ability)' : 'transparent',
      border: '1px solid white',
      borderRadius: '2px',
    }} />
    <Handles nodeId={id} color={'var(--node-ability)'} />
    <span className="icon"><FiStar className="node-icon icon-ability" role="img" aria-label="Icono de habilidad" /></span>
    <NodeTitle value={data.title} />
  </article>
);
