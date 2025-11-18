# Guía de estilos y Wireframe

La guía de estilos y los wireframes se encuentran representados en [FIGMA](https://www.figma.com/design/MKMaNRbpJsggaBagJbezYT/Bossflow?node-id=15-173)

## 🖋️ Tipografía

**Familia:** Inter  
**Ventajas:**  
- Alta legibilidad en pantallas.  
- Estética neutra, moderna y técnica.  
- Ideal para entornos colaborativos o técnicos.

### Escala tipográfica

| Estilo | Tamaño (px) | Uso |
|---------|-------------|-----|
| H1 | 64 | Título principal |
| H2 | 36 | Subtítulo o sección |
| H3 | 28 | Encabezado secundario |
| H4 | 22 | Subsección |
| H5 | 18 | Etiquetas o encabezados pequeños |
| Párrafo | 16 | Texto principal o descripciones |
| Texto pequeño | 14 | Notas o ayudas contextuales |
| Mini | 12 | Etiquetas o metadatos |

---

## 🌈 Paleta de Colores

### Colores principales

| Rol                 | HEX      | Uso en la página                              |
|---------------------|----------|-----------------------------------------------|
| **Primario**        | `#1D3254` | Fondo principal                 |
| **Primario Claro**   | `#1F2D44` | Fondo del header, footer                         |
| **Primario Oscuro**  | `#1E293B` | Botones, bordes, títulos destacados |
| **Secundario**       | `#EAB308` | Botones secundarios, palabras destacadas e iconos       |
| **Secundario Claro** | `#D6A50A` | Hover de botones secundarios, elementos resaltados |
| **Secundario Oscuro**| `#B48B09` | Estados clicked de botones secundarios, bordes |

### Escala de grises

| Nombre | HEX | Uso |
|--------|------|-----|
| Blanco | `#F8FAFC` | Cards, Elementos generales (formularios)|
| Gris 1 | `#E4E4E4` | Bordes suaves |
| Gris 2 | `#BFBFBF` | Estados desactivados |
| Gris 3 | `#A2A2A2` | Texto secundario |
| Gris 4 | `#818181` | Etiquetas o texto inactivo |
| Gris 5 | `#6D6D6D` | Texto en fondos claros |
| Gris 6 | `#505050` | Textos en fondos muy claros |
| Gris 7 | `#464646` | Versión más oscura del anterior |
| Negro | `#2E2E2E` | Texto oscuro principal |

---

## 🧩 Componentes Principales

### 🔹 Botones

| Tipo | Default | Hover | Clicked | Disabled |
|------|--------|--------|--------|----------|
| **Principal** | `#1E293B` | `#FFFFFF` | `#172D44` | `Opacidad 34%` |
| **Secundario** | `#EAB308` | `#D6A50A` | `#B48B09` | `Opacidad 34%` |
| **Blanco Excepcional** | `#F8FAFC` | `#E4E4E4` | `#A2A2A2` | `Opacidad 34%` |

**Decisiones:**   
El **botón blanco excepcional** se usa sobre fondos oscuros para destacar acciones críticas.

### 🔸 Inputs

| Estado | Borde | Fondo | Texto |
|---------|--------|--------|--------|
| Default | `#E4E4E4` | `#FFFFFF` | `#475569` |
| Hover | `#A0A0A2` | `#FFFFFF` | `#0F172A` |
| Focus | `#059669` | `#FFFFFF` | `#0F172A` |
| Error | `#EF4444` | `#FEF2F2` | `#B91C1C` |
| Disabled | `#BFBFBF` | `#F8FAFC` | `#94A3B8` |

### 🔘 Checkboxes

| Estado | Borde | Descripción |
|---------|----------------|-------------|
| Default | `#A3A3A3` | Borde gris medio |
| Focused | `#2E2E2E` | Indicador de foco accesible |
| Checked | `#A3A3A3` | Mismo borde que el defaut pero checked |
| Disabled | `Opacidad 20%` | Estado inactivo |

---

## 📏 Espaciado y Tamaños

| Variable | Valor (px) | Uso |
|-----------|-------------|-----|
| XS | 4 | Separaciones mínimas |
| S | 8 | Espaciado interno pequeño |
| M | 16 | Padding estándar |
| L | 32 | Márgenes amplios |
| XL | 48 | Secciones grandes |
| XXL | 64 | Bloques o encabezados |
