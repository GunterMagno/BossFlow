import './Pricing.css';

function Pricing() {
  const palabrasGratis = [
    'GRATIS',
    'FREE',
    'GRATUIT',
    'KOSTENLOS',
    'GRATUITO',
    '無料',
    'БЕСПЛАТНО',
    'ΔΩΡΕΆΝ',
    'مجانا',
    '免费',
    'ILMAINEN',
    'INGYEN',
    'ZADARMO',
    'LIBRE',
    '무료',
    'ฟรี',
    'ÜCRETSIZ',
    'MIỄN PHÍ',
    'GRÁTIS',
    'GRATUÏT',
    'BESPLATNO',
    'PERCUMA',
    'LIBER',
    'ÜCRETSIZ',
    'MIEN PHI',
    'GRATË',
    'БЕПЛАТНА',
    'FREE',
    'GRATIS',
    'БЕЗПЛАТНО',
    'NEMOKAMA',
    'BEZMAKSAS',
    'TASUTA',
    'GRATUITO',
    'GRATUITO',
    'ମୁକ୍ତ',
    'BESPLATNO',
    'ZDARMA',
    'INGYENES'
  ];

  return (
    <div className="pricing">
      {/* Fila 1: Izquierda a Derecha */}
      <div className="pricing__fila pricing__fila--izq-der">
        <div className="pricing__contenedor">
          {[...palabrasGratis, ...palabrasGratis, ...palabrasGratis].map((palabra, index) => (
            <span key={`fila1-${index}`} className="pricing__palabra">
              {palabra}
            </span>
          ))}
        </div>
      </div>

      {/* Fila 2: Derecha a Izquierda */}
      <div className="pricing__fila pricing__fila--der-izq">
        <div className="pricing__contenedor">
          {[...palabrasGratis, ...palabrasGratis, ...palabrasGratis].map((palabra, index) => (
            <span key={`fila2-${index}`} className="pricing__palabra">
              {palabra}
            </span>
          ))}
        </div>
      </div>

      {/* Fila 3: Izquierda a Derecha */}
      <div className="pricing__fila pricing__fila--izq-der">
        <div className="pricing__contenedor">
          {[...palabrasGratis, ...palabrasGratis, ...palabrasGratis].map((palabra, index) => (
            <span key={`fila3-${index}`} className="pricing__palabra">
              {palabra}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pricing;
