# Delivery Insight

Quiero crear la interfaz frontend de una aplicación web llamada TecnoMarket Analytics.

IMPORTANTE: esta aplicación NO es un e-commerce y NO es un sistema completo de gestión de pedidos.

La aplicación representa una plataforma de Data Analytics + Machine Learning orientada a la predicción de retrasos en entregas.

1. CONTEXTO DEL PROYECTO

TecnoMarket es una empresa ficticia de venta de productos tecnológicos que ya posee otro sistema externo donde se generan y gestionan sus pedidos.

Nuestra aplicación no reemplaza ese sistema.

Los pedidos provienen de una fuente externa y nuestra aplicación utiliza esos datos para:

Analizar pedidos históricos.

Visualizar indicadores logísticos.

Filtrar y consultar pedidos.

Analizar patrones de retrasos.

Realizar predicciones mediante Machine Learning.

Ayudar a la toma de decisiones.

Por lo tanto:

NO crear:

Carrito de compras.

Checkout.

Pasarela de pagos.

Catálogo de productos como tienda.

Sistema completo de clientes.

Gestión compleja de inventario.

CMS de pedidos.

Registro manual obligatorio de pedidos.

La aplicación debe sentirse como una plataforma profesional de Analytics / Business Intelligence / Machine Learning.

2. TECNOLOGÍAS DEL FRONTEND

Utilizar:

React

Vite

TypeScript

Tailwind CSS

Componentes modernos y reutilizables.

Diseño responsive.

La interfaz debe estar preparada para posteriormente conectarse a un backend mediante una API REST.

Por ahora se pueden utilizar datos mock, pero la arquitectura debe permitir reemplazarlos posteriormente por llamadas reales a FastAPI.

3. ESTILO VISUAL

Quiero un diseño:

Moderno.

Profesional.

Minimalista.

Tecnológico.

Orientado a dashboards empresariales.

Limpio.

Fácil de navegar.

Debe parecer una aplicación utilizada por un equipo de:

Logística.

Data Analytics.

Operaciones.

Business Intelligence.

NO debe parecer una tienda online.

Utilizar una interfaz tipo SaaS empresarial.

La navegación principal debe utilizar un sidebar lateral.

4. ESTRUCTURA PRINCIPAL

Crear una aplicación con las siguientes secciones:

Dashboard

Ruta:

/dashboard

Debe ser la pantalla principal.

Mostrar:

Total de pedidos analizados.

Pedidos entregados a tiempo.

Pedidos tardíos.

Porcentaje de retrasos.

Predicciones realizadas.

Nivel de riesgo general.

Agregar gráficos como:

Evolución de entregas tardías.

Pedidos por región.

Retrasos por tipo de envío.

Distribución entre entregas a tiempo y tardías.

Tendencia mensual.

Utilizar cards/KPIs y gráficos modernos.

5. MÓDULO PEDIDOS

Ruta:

/orders

Esta pantalla NO debe permitir crear pedidos como si fuera un ERP.

Su función es consultar y analizar los pedidos existentes provenientes de una fuente externa.

Crear una tabla profesional con columnas como:

ID del pedido.

Fecha.

Región.

Tipo de envío.

Distancia.

Tiempo de preparación.

Cantidad de productos.

Peso.

Estado de entrega.

Riesgo.

Agregar:

Buscador.

Filtros.

Ordenamiento.

Paginación.

Filtro por fecha.

Filtro por región.

Filtro por tipo de envío.

Filtro por estado.

Al hacer clic en un pedido, mostrar un panel/modal con sus detalles.

6. MÓDULO PREDICCIÓN

Ruta:

/prediction

Esta es una de las partes principales de la aplicación.

Crear una interfaz llamada:

Predicción de entrega

El usuario debe introducir las características de un pedido para obtener una predicción.

Ejemplo de campos:

Tipo de envío.

Distancia.

Tiempo estimado.

Tiempo de preparación.

Cantidad de productos.

Peso del pedido.

Región.

Prioridad.

Día de la semana.

Carga logística.

Después de pulsar:

"Realizar predicción"

mostrar un resultado visual.

Ejemplo:

Predicción:

ENTREGA TARDÍA

Probabilidad:

78%

Nivel de riesgo:

ALTO

También mostrar una explicación visual de los factores que más contribuyeron al riesgo.

IMPORTANTE:

La interfaz debe estar preparada para que posteriormente el formulario realice:

POST /api/predict

hacia un backend FastAPI.

7. MÓDULO ANALÍTICA

Ruta:

/analytics

Crear una sección dedicada al análisis de datos.

Mostrar gráficos y estadísticas como:

Retrasos por región.

Retrasos por tipo de envío.

Retrasos según distancia.

Retrasos según tiempo de preparación.

Distribución de pedidos.

Tendencias temporales.

Variables asociadas a mayor riesgo.

Debe sentirse como una herramienta de Business Intelligence.

8. MÓDULO MODELO ML

Ruta:

/model

Crear una sección donde se pueda visualizar información del modelo de Machine Learning.

Mostrar:

Modelo seleccionado.

Accuracy.

Precision.

Recall.

F1-score.

ROC-AUC si está disponible.

Fecha de entrenamiento.

Cantidad de registros utilizados.

Distribución de clases.

También mostrar una visualización de:

Importancia de variables

Por ejemplo:

Tiempo de preparación — 32%

Distancia — 25%

Tipo de envío — 18%

Carga logística — 13%

Peso — 7%

Otros — 5%

Los datos serán mock inicialmente.

9. NAVEGACIÓN

El sidebar debe contener aproximadamente:

Dashboard

Pedidos

Predicción

Analítica

Modelo ML

En la parte inferior:

Configuración

Perfil

Agregar un header superior con:

Nombre de la sección.

Buscador opcional.

Notificaciones.

Perfil del usuario.

10. DASHBOARD — INFORMACIÓN DE EJEMPLO

Utilizar datos mock realistas.

Por ejemplo:

Total pedidos:

5,000

Entregas a tiempo:

4,125

Entregas tardías:

875

Tasa de retrasos:

17.5%

Predicciones:

1,248

Estos datos solamente serán utilizados para visualizar la interfaz.

11. COMPONENTES

Crear componentes reutilizables.

Por ejemplo:

Sidebar

Header

KPI Card

Charts

DataTable

FilterBar

PredictionForm

PredictionResult

RiskBadge

OrderDetails

ModelMetrics

LoadingState

EmptyState

12. RESPONSIVE DESIGN

La aplicación debe funcionar correctamente en:

Desktop.

Laptop.

Tablet.

La prioridad visual es desktop porque será utilizada principalmente como dashboard empresarial.

13. ARQUITECTURA DEL FRONTEND

Organizar el código de forma limpia.

Una estructura aproximada:

frontend/

src/

components/

pages/

services/

hooks/

types/

layouts/

lib/

App.tsx

No colocar toda la aplicación en un único archivo.

Separar componentes y páginas.

14. PREPARACIÓN PARA BACKEND

Aunque inicialmente se utilicen datos mock, crear una capa de servicios para que posteriormente podamos conectar FastAPI.

Por ejemplo:

src/services/api.ts

Y servicios conceptuales como:

getOrders()

getDashboard()

getAnalytics()

predictDelivery()

getModelInfo()

No implementar todavía un backend real.

15. RESULTADO ESPERADO

Quiero que la aplicación final transmita claramente esta idea:

"TecnoMarket Analytics utiliza datos históricos de pedidos y Machine Learning para analizar y predecir el riesgo de retrasos en las entregas."

La aplicación debe verse como un producto tecnológico real y profesional.

No quiero una tienda online.

No quiero un ERP.

No quiero un CMS de pedidos.

Quiero una plataforma de:

DATA ANALYTICS + MACHINE LEARNING + LOGÍSTICA

Construye la interfaz completa con navegación funcional entre las páginas y datos mock realistas.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/57f51221-afd1-4322-ba74-4153714b8384).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
