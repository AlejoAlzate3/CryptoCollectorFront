# Autenticación Frontend - CryptoCollector

## 🎉 Implementación Completa

Se ha implementado toda la funcionalidad de autenticación para conectar el frontend Angular con el backend Spring Boot.

## 📁 Archivos Creados/Modificados

### ✅ Modelos (Interfaces TypeScript)
- `src/app/core/models/auth.models.ts` - Interfaces para autenticación
- `src/app/core/models/crypto.models.ts` - Interfaces para criptomonedas

### ✅ Servicios
- `src/app/core/services/auth.service.ts` - Servicio de autenticación (login, registro, logout)
- `src/app/core/services/crypto.service.ts` - Servicio de criptomonedas (listo para usar)

### ✅ Interceptors
- `src/app/core/interceptors/auth.interceptor.ts` - Agrega automáticamente el token JWT a todas las peticiones

### ✅ Guards
- `src/app/core/guards/auth.guard.ts` - Protege las rutas que requieren autenticación

### ✅ Configuración
- `src/environments/environment.ts` - Configuración para desarrollo (API: http://localhost:8080)
- `src/environments/environment.prod.ts` - Configuración para producción
- `src/app/app.config.ts` - Configuración global con interceptor registrado

### ✅ Componentes Actualizados
- `src/app/dashboard/login/` - Login completamente funcional
- `src/app/dashboard/signup/` - Registro completamente funcional

### ✅ Rutas Protegidas
- `src/app/crypto/crypto.routes.ts` - Rutas de crypto protegidas con authGuard

---

## 🚀 Cómo Funciona

### 1. Flujo de Registro (Signup)
1. Usuario completa el formulario de registro
2. Se valida que las contraseñas coincidan (mínimo 6 caracteres)
3. Se envía `POST /api/auth/register` al backend
4. Si es exitoso, muestra mensaje de éxito y redirige al login
5. Si falla (email duplicado, etc.), muestra error

### 2. Flujo de Login
1. Usuario ingresa email y contraseña
2. Se envía `POST /api/auth/login` al backend
3. Backend retorna un token JWT
4. Token se guarda en localStorage
5. Usuario es redirigido a `/crypto`
6. El interceptor agrega automáticamente el token a todas las peticiones subsecuentes

### 3. Protección de Rutas
- Las rutas bajo `/crypto` están protegidas con `authGuard`
- Si el usuario no está autenticado, es redirigido a `/dashboard/login`
- La URL original se guarda en `returnUrl` para redirigir después del login

### 4. Manejo de Tokens
- **Almacenamiento**: `localStorage` con clave `auth_token`
- **Interceptor**: Agrega automáticamente `Authorization: Bearer <token>` a cada petición
- **Expiración**: Si el backend responde 401, el interceptor:
  - Elimina el token
  - Redirige al login
  - Muestra mensaje de sesión expirada

---

## 🧪 Cómo Probar

### Paso 1: Asegúrate de que el backend esté corriendo

```bash
cd Crypto
docker-compose up -d
```

Verifica que los servicios estén activos:
- API Gateway: http://localhost:8080
- Eureka Dashboard: http://localhost:8761

### Paso 2: Inicia el frontend Angular

```bash
cd crytoCollectorFront
npm install  # Si es primera vez
npm start
```

La aplicación estará disponible en: http://localhost:4200

### Paso 3: Prueba el flujo completo

#### A) Registro de Usuario
1. Ve a http://localhost:4200
2. Serás redirigido a `/dashboard/login`
3. Haz clic en "Registrarse"
4. Completa el formulario:
   - Nombre: `Juan`
   - Apellido: `Pérez`
   - Email: `juan@example.com`
   - Contraseña: `123456` (mínimo 6 caracteres)
   - Confirmar contraseña: `123456`
5. Haz clic en "Registrarse"
6. Deberías ver un mensaje de éxito y ser redirigido al login

#### B) Login
1. Ingresa las credenciales:
   - Email: `juan@example.com`
   - Contraseña: `123456`
2. Haz clic en "Iniciar Sesión"
3. Si es exitoso, serás redirigido a `/crypto`

#### C) Verificación de Token
1. Abre las DevTools (F12)
2. Ve a la pestaña "Application" o "Almacenamiento"
3. En "Local Storage" deberías ver:
   - Clave: `auth_token`
   - Valor: Un largo token JWT (ej: `eyJhbGciOiJIUzI1NiIsInR5...`)

#### D) Protección de Rutas
1. Cierra sesión (puedes hacerlo desde la consola):
   ```javascript
   localStorage.removeItem('auth_token');
   ```
2. Intenta acceder a http://localhost:4200/crypto
3. Deberías ser redirigido automáticamente a `/dashboard/login`

---

## 🔧 Configuración del Backend

Asegúrate de que el archivo `.env` en el backend tenga:

```env
# JWT Configuration
JWT_SECRET=change_this_to_a_real_secret
JWT_EXPIRATION=86400000  # 24 horas en milisegundos

# API Gateway
CONFIG_SERVER_URI=http://config-server:8888
```

---

## 📊 Endpoints del Backend Utilizados

### Autenticación (Públicos)
- `POST http://localhost:8080/api/auth/register`
  ```json
  {
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "password": "123456"
  }
  ```

- `POST http://localhost:8080/api/auth/login`
  ```json
  {
    "email": "juan@example.com",
    "password": "123456"
  }
  ```
  **Respuesta:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Criptomonedas (Requieren JWT)
- `GET http://localhost:8080/api/crypto/list?page=0&size=20`
- `GET http://localhost:8080/api/crypto/bitcoin`
- `GET http://localhost:8080/api/crypto/stats`
- `GET http://localhost:8080/api/crypto/scheduler/status`
- `POST http://localhost:8080/api/crypto/sync`

---

## 🐛 Solución de Problemas

### Error: "No se pudo conectar con el servidor"
**Causa**: El backend no está corriendo o no está accesible en el puerto 8080.

**Solución**:
```bash
cd Crypto
docker-compose ps  # Verifica el estado de los contenedores
docker-compose logs api-gateway  # Verifica logs del gateway
```

### Error: "Credenciales inválidas"
**Causa**: El email o la contraseña son incorrectos.

**Solución**: Verifica que el usuario esté registrado en la base de datos.

### Error: "El email ya está registrado"
**Causa**: Ya existe un usuario con ese email.

**Solución**: Usa otro email o inicia sesión con el existente.

### Error 401 en peticiones a /api/crypto/*
**Causa**: El token es inválido, ha expirado o no se está enviando.

**Solución**:
1. Verifica que el token esté en localStorage
2. Cierra sesión y vuelve a iniciar sesión
3. Verifica en DevTools → Network que el header `Authorization: Bearer <token>` se esté enviando

### CORS Error
**Causa**: El backend no permite peticiones desde http://localhost:4200

**Solución**: Configura CORS en el API Gateway (normalmente ya está configurado en development)

---

## 📝 Próximos Pasos

✅ Autenticación completa
✅ Guards y protección de rutas
✅ Interceptor JWT
✅ Manejo de errores

🔜 **Próximas funcionalidades a implementar**:
1. Implementar componente `CryptoListComponent` (listar criptomonedas)
2. Implementar componente `CryptoDetailComponent` (detalle de crypto)
3. Agregar paginación y búsqueda
4. Implementar funcionalidad de logout visible
5. Agregar navbar con información del usuario
6. Implementar funcionalidad de sincronización manual

---

## 🎯 Características Implementadas

✅ Registro de usuarios  
✅ Login con JWT  
✅ Almacenamiento seguro de tokens  
✅ Interceptor automático para agregar JWT  
✅ Guard para proteger rutas  
✅ Manejo de errores global  
✅ Redirección automática en logout  
✅ Validaciones de formularios  
✅ Mensajes de error/éxito  
✅ Estados de carga (loading)  
✅ Servicio de criptomonedas listo para usar  

---

## 👨‍💻 Estructura del Código

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts                 # Protege rutas
│   ├── interceptors/
│   │   └── auth.interceptor.ts           # Agrega JWT a peticiones
│   ├── models/
│   │   ├── auth.models.ts                # Interfaces de autenticación
│   │   └── crypto.models.ts              # Interfaces de criptomonedas
│   └── services/
│       ├── auth.service.ts               # Lógica de autenticación
│       └── crypto.service.ts             # Lógica de criptomonedas
├── dashboard/
│   ├── login/                            # Componente de login
│   └── signup/                           # Componente de registro
└── crypto/
    ├── crypto-list/                      # Lista de cryptos (por implementar)
    └── crypto-detail/                    # Detalle de crypto (por implementar)
```

---

¡La autenticación está completamente funcional! 🎉
