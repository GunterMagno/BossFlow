import { useState, useMemo } from 'react';
import { getSmoothStepPath } from 'reactflow';

/**
 * Arista personalizada para el diagrama de flujo con efectos visuales
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - Identificador único de la arista
 * @param {number} props.sourceX - Coordenada X del punto de origen
 * @param {number} props.sourceY - Coordenada Y del punto de origen
 * @param {number} props.targetX - Coordenada X del punto de destino
 * @param {number} props.targetY - Coordenada Y del punto de destino
 * @param {string} props.sourcePosition - Posición del conector de origen
 * @param {string} props.targetPosition - Posición del conector de destino
 * @param {Object} [props.style={}] - Estilos CSS adicionales
 * @param {string} props.markerEnd - Marcador SVG para el final de la arista
 * @param {Object} [props.data={}] - Datos adicionales de la arista
 * @param {boolean} [props.selected=false] - Indica si la arista está seleccionada
 * @param {boolean} [props.animated=false] - Indica si la arista debe animarse
 * @returns {JSX.Element} Elemento SVG path representando la arista
 */
const CustomEdge = ({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	style = {},
	markerEnd,
	data = {},
	selected = false,
	animated = false,
}) => {
	const [edgePath] = getSmoothStepPath({ 
		sourceX, 
		sourceY, 
		sourcePosition, 
		targetX, 
		targetY, 
		targetPosition,
		
	});
	const [hover, setHover] = useState(false);

	const connecting = Boolean(data && data.connecting);

	const edgeStyle = useMemo(() => {
		const base = {
			stroke: '#e4e2e2ff',
			strokeWidth: 3.5,
			fill: 'none',
		};

		if (hover || selected) {
			return {
				...base,
				stroke: '#fff',
				strokeWidth: 4.5,
				filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.2))',
				cursor: 'pointer',
				...style,
			};
		}

		if (animated) {
			return {
				...base,
				strokeDasharray: '5 5',
				...style,
			};
		}

		return { ...base, ...style };
	}, [connecting, hover, selected, animated, style]);

	return (
		<path
			id={id}
			className="react-flow__edge-path"
			d={edgePath}
			style={edgeStyle}
			markerEnd={markerEnd}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		/>
	);
};

export default CustomEdge;
