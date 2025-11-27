import { useState, useMemo } from 'react';
import { getSmoothStepPath } from 'reactflow';

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

	// data.connecting -> estado visual cuando la conexión se intenta conectar
	const connecting = Boolean(data && data.connecting);

	const edgeStyle = useMemo(() => {
		// base style (blanco y grosor por defecto)
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
