# 🌲 TreeSAR — NASA Space Apps MVP

**TreeSAR** es una aplicación **MVP** desarrollada para el **hackathon NASA Space Apps**, que analiza imágenes de satélite **SAR (Synthetic Aperture Radar)** para visualizar el impacto ambiental de la **deforestación** en diferentes regiones del mundo.

---

## 🌍 Características Principales

✨ **Globo 3D Interactivo:** Visualización del planeta Tierra con *waypoints* en zonas de deforestación  
🗺️ **Mapas Interactivos:** Análisis detallado de sitios con capas SAR  
🌡️ **Datos Ambientales:** Información en tiempo real sobre impacto ecológico  
🚀 **Diseño Espacial:** Interfaz futurista con *glassmorphism* y animaciones suaves  
📱 **Totalmente Responsivo:** Compatible con móvil, tablet y escritorio  

---

## 🧠 Tecnologías Utilizadas

| Categoría | Tecnologías |
|------------|-------------|
| 🌐 **Frontend** | Next.js 14 (App Router), React, TypeScript |
| 🪐 **Visualización 3D** | React Three Fiber + Drei |
| 🗺️ **Mapas** | React Leaflet |
| 🎨 **Estilos y Animaciones** | TailwindCSS, Framer Motion |
| ⚙️ **Tipado** | TypeScript |

---

## ⚙️ Instalación y Ejecución

1. Clona el repositorio:
```bash
git clone <repository-url>
cd treesar
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta la aplicación en modo desarrollo:
```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

🗂️ Estructura del Proyecto
```
treesar/
├── app/
│   ├── globals.css          # Estilos globales con tema espacial
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Página de inicio (globo 3D)
│   └── site/[id]/
│       └── page.tsx         # Página de sitio individual
├── components/
│   ├── Globe.tsx            # Componente del globo 3D
│   ├── InteractiveMap.tsx   # Mapa interactivo con Leaflet
│   ├── LayerSwitcher.tsx    # Selector de capas SAR
│   └── InfoPanel.tsx        # Panel de información ambiental
├── data/
│   └── sites.json           # Datos mock de sitios de deforestación
└── public/
    └── images/              # Imágenes mock (satelitales, SAR)
```

## 🔧 Funcionalidades

### Página Principal (`/`)
- Globo 3D que rota automáticamente
- Waypoints interactivos en ubicaciones de deforestación
- Información de sitios al hacer clic
- Navegación a páginas de sitios individuales

### Página de Sitio (`/site/[id]`)
- Mapa interactivo centrado en el sitio
- Selector de capas SAR (HH, VH, )
- Panel de información ambiental expandible
- Alertas de riesgo de deforestación
- Polígonos que muestran áreas afectadas

## 📊 Datos Mock Incluidos

- Probabilidad de origen (humano vs. fuego natural)
- Número de árboles afectados
- Emisiones de ozono estimadas
- Animales afectados
- Área total afectada
- Fechas de última actualización

## 🏆 NASA Space Apps

Desarrollado para el hackathon NASA Space Apps, este proyecto demuestra el potencial de las tecnologías web modernas para visualizar y analizar datos satelitales de manera accesible e interactiva.
