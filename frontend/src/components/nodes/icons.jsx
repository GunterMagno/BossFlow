import React from 'react';
import './icons.css';

/**
 * Componente de icono para nodos de tipo decisión.
 * Representa una bifurcación o punto de decisión en el diagrama.
 *
 * @param {Object} props - Propiedades SVG del componente
 * @returns {JSX.Element} Elemento SVG del icono de decisión
 */
export const DecisionIcon = (props) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" {...props}>
        <path d="M13.5 15.75C14.7426 15.75 15.75 14.7426 15.75 13.5C15.75 12.2574 14.7426 11.25 13.5 11.25C12.2574 11.25 11.25 12.2574 11.25 13.5C11.25 14.7426 12.2574 15.75 13.5 15.75Z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.5 6.75C5.74264 6.75 6.75 5.74264 6.75 4.5C6.75 3.25736 5.74264 2.25 4.5 2.25C3.25736 2.25 2.25 3.25736 2.25 4.5C2.25 5.74264 3.25736 6.75 4.5 6.75Z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.5 15.75V6.75C4.5 8.54021 5.21116 10.2571 6.47703 11.523C7.7429 12.7888 9.45979 13.5 11.25 13.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>

);

/**
 * Componente de icono para nodos de tipo acción.
 * Representa una acción o actividad en el flujo del diagrama.
 *
 * @param {Object} props - Propiedades SVG del componente
 * @returns {JSX.Element} Elemento SVG del icono de acción
 */
export const ActionIcon = (props) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" {...props}>
        <path
        d="M16.5 9H14.64C14.3122 8.9993 13.9932 9.10598 13.7318 9.30373C13.4704 9.50147 13.281 9.7794 13.1925 10.095L11.43 16.365C11.4186 16.4039 11.395 16.4382 11.3625 16.4625C11.33 16.4868 11.2906 16.5 11.25 16.5C11.2094 16.5 11.17 16.4868 11.1375 16.4625C11.105 16.4382 11.0814 16.4039 11.07 16.365L6.93 1.635C6.91864 1.59605 6.89496 1.56184 6.8625 1.5375C6.83004 1.51316 6.79057 1.5 6.75 1.5C6.70943 1.5 6.66996 1.51316 6.6375 1.5375C6.60504 1.56184 6.58136 1.59605 6.57 1.635L4.8075 7.905C4.71935 8.21937 4.53104 8.49639 4.27115 8.69401C4.01126 8.89163 3.69399 8.99907 3.3675 9H1.5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        />
    </svg>

);

/**
 * Componente de icono para nodos de tipo fase.
 * Representa una fase o etapa del proceso en el diagrama.
 *
 * @param {Object} props - Propiedades SVG del componente
 * @returns {JSX.Element} Elemento SVG del icono de fase
 */
export const PhaseIcon = (props) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" {...props}>
        <path
        d="M3 11.25C3 11.25 3.75 10.5 6 10.5C8.25 10.5 9.75 12 12 12C14.25 12 15 11.25 15 11.25V2.25C15 2.25 14.25 3 12 3C9.75 3 8.25 1.5 6 1.5C3.75 1.5 3 2.25 3 2.25V11.25Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        />
        <path d="M3 16.5V11.25" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/**
 * Componente de icono para nodos de tipo efecto.
 * Representa un efecto o resultado en el flujo del diagrama.
 *
 * @param {Object} props - Propiedades SVG del componente
 * @returns {JSX.Element} Elemento SVG del icono de efecto
 */
export const EffectIcon = (props) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" {...props}>
        <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 13.5C11.4853 13.5 13.5 11.4853 13.5 9C13.5 6.51472 11.4853 4.5 9 4.5C6.51472 4.5 4.5 6.51472 4.5 9C4.5 11.4853 6.51472 13.5 9 13.5Z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 10.5C9.82843 10.5 10.5 9.82843 10.5 9C10.5 8.17157 9.82843 7.5 9 7.5C8.17157 7.5 7.5 8.17157 7.5 9C7.5 9.82843 8.17157 10.5 9 10.5Z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>

);

/**
 * Componente de icono para nodos de inicio o fin.
 * Representa un punto de inicio o finalización en el diagrama.
 *
 * @param {Object} props - Propiedades SVG del componente
 * @returns {JSX.Element} Elemento SVG del icono de inicio/fin
 */
export const StartEndIcon = (props) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" {...props}>
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export default { DecisionIcon, ActionIcon, PhaseIcon, EffectIcon, StartEndIcon };
