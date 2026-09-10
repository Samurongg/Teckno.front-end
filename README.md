# TecnoMarket Analytics — Frontend

## Descripción del trabajo

TecnoMarket Analytics es una plataforma web de Data Analytics y Machine Learning para una empresa ficticia de tecnología. Convierte los datos históricos de pedidos en indicadores, reportes y predicciones de retraso que apoyan las decisiones logísticas.

La aplicación no es un e-commerce y no crea pedidos, pagos ni inventario. Consume la API del backend para analizar pedidos ya existentes y estimar el riesgo de entrega tardía.

## Qué puede hacer el usuario

- Iniciar y cerrar una sesión de demostración.
- Consultar el dashboard de rendimiento logístico.
- Explorar pedidos históricos y ver su información.
- Simular un pedido para calcular su riesgo de retraso.
- Comparar retrasos por departamento, zona logística, envío, distancia y preparación.
- Revisar las métricas, clases e importancia de variables del modelo ML.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| React 19 | Interfaz de usuario |
| TypeScript | Tipado y mantenimiento del código |
| Vite / TanStack Start | Desarrollo, rutas y compilación |
| TanStack Router | Navegación entre pantallas |
| TanStack Query | Consultas y estado de datos remotos |
| Tailwind CSS | Estilos responsivos |
| Radix UI | Componentes accesibles |
| Recharts | Gráficos del dashboard y analítica |
| FastAPI REST | Fuente de datos y predicciones |

## Requisitos

- Node.js 20 o superior.
- El backend de TecnoMarket Analytics activo en el puerto `8000`.

## Instalación y ejecución

```powershell
cd C:\Users\adria\Desktop\TECKNOFRONT\Teckno.front-end
npm install
npm run dev
```

Abre la URL que indique la consola, normalmente `http://localhost:3000` o `http://localhost:5173`.

La variable `VITE_API_BASE_URL` se configura en `.env` y por defecto apunta a:

```text
http://127.0.0.1:8000/api
```

## Manual de usuario

### 1. Iniciar sesión

Al abrir la aplicación aparece la pantalla de acceso. Usa las credenciales de demostración:

| Correo | `analyst@tecnomarket.pe` |
| Contraseña | `teckno2026` |

La sesión de demostración se guarda únicamente en el navegador. Para salir, pulsa el icono de cierre de sesión en la parte superior derecha.

> Este login es demostrativo. Para un entorno productivo se requiere autenticación real en el backend, contraseñas cifradas y tokens de acceso.

### 2. Dashboard

Es la pantalla principal. Resume el total de pedidos, entregas puntuales y tardías, tasa de retraso, cantidad de predicciones y riesgo general. Los gráficos muestran evolución mensual, distribución de entregas, pedidos por zona logística y retrasos por tipo de envío.

### 3. Pedidos

Permite revisar la información histórica enviada desde la base de datos: fecha, departamento, zona logística, transporte, distancia, envío, carga, peso y estado. Selecciona un pedido para ver su detalle.

### 4. Predicción de entrega

Completa las características del pedido y pulsa **Realizar predicción**. El sistema envía los datos al backend y muestra:

- Resultado: entrega a tiempo o tardía.
- Probabilidad de retraso.
- Nivel de riesgo: bajo, medio o alto.

Los valores deben corresponder a un pedido plausible; el backend valida distancia, peso, cantidad y tiempos antes de ejecutar el modelo.

### 5. Analítica

Muestra comparaciones de tasas de retraso por departamento, zona logística, tipo de envío, distancia y tiempo de preparación, además de distribución de pedidos y tendencia temporal. Todas las gráficas consumen los agregados generados por la API.

### 6. Modelo ML

Presenta el algoritmo seleccionado, fecha de entrenamiento, número de registros, métricas de evaluación e importancia global de las variables. La importancia es calculada desde el modelo cargado, no con porcentajes visuales simulados.

### 7. Perfil y configuración

El perfil muestra la cuenta de demostración y su actividad. La configuración contiene opciones de presentación de la plataforma.

## Conexión con el backend

Antes de usar el frontend, inicia el backend en otra terminal:

```powershell
cd C:\Users\adria\Desktop\TECKNOBACK\Teckno.back-end
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

Si la pantalla muestra un error de conexión, comprueba primero `http://127.0.0.1:8000/api/health`. Debe responder con el estado `online`.

## Comandos útiles

```powershell
npm run dev      # Ejecuta el entorno de desarrollo
npm run lint     # Revisa calidad de código
npm run build    # Genera la compilación de producción
npm run preview  # Previsualiza la compilación
```
