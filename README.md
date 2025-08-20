# 🚀 RutinaApp - App Nativa para iOS y Android

## 📱 **Características**
- ✅ **App nativa** para iOS y Android
- ✅ **Notificaciones push** en tiempo real
- ✅ **Instalable** desde App Store y Google Play
- ✅ **Funciona offline** con sincronización
- ✅ **Notificaciones locales** para eventos

## 🛠️ **Requisitos previos**

### **Para iOS:**
- **Mac** con macOS (requerido para desarrollo iOS)
- **Xcode** 14+ instalado
- **Apple Developer Account** (para publicar en App Store)

### **Para Android:**
- **Android Studio** instalado
- **Java Development Kit (JDK)** 11+
- **Google Play Console** (para publicar en Play Store)

## 📦 **Instalación y configuración**

### **Paso 1: Instalar dependencias**
```bash
# Navegar a la carpeta del proyecto
cd "C:\Users\Arian\Documents\RutinaApp_Nueva"

# Instalar Node.js si no lo tienes (desde nodejs.org)

# Instalar dependencias
npm install

# Instalar Capacitor CLI globalmente
npm install -g @capacitor/cli
```

### **Paso 2: Inicializar Capacitor**
```bash
# Inicializar Capacitor
npx cap init

# Agregar plataformas
npx cap add ios
npx cap add android

# Sincronizar archivos
npx cap sync
```

### **Paso 3: Configurar iOS**

#### **3.1 Abrir en Xcode:**
```bash
npx cap open ios
```

#### **3.2 Configurar en Xcode:**
1. **Seleccionar tu equipo** de desarrollo
2. **Cambiar Bundle Identifier** a algo único (ej: `com.tunombre.rutinaapp`)
3. **Configurar certificados** de desarrollo
4. **Configurar capacidades** (Push Notifications, Background Modes)

#### **3.3 Configurar Push Notifications:**
1. **Crear APNs Key** en Apple Developer Portal
2. **Configurar Firebase** para notificaciones push
3. **Agregar archivo** `GoogleService-Info.plist`

### **Paso 4: Configurar Android**

#### **4.1 Abrir en Android Studio:**
```bash
npx cap open android
```

#### **4.2 Configurar en Android Studio:**
1. **Sincronizar proyecto** Gradle
2. **Configurar aplicación** en `AndroidManifest.xml`
3. **Configurar Firebase** para notificaciones push
4. **Agregar archivo** `google-services.json`

## 🔔 **Configuración de Notificaciones Push**

### **Firebase Setup:**
1. **Crear proyecto** en [Firebase Console](https://console.firebase.google.com/)
2. **Agregar app** iOS y Android
3. **Descargar archivos** de configuración
4. **Configurar Cloud Messaging**

### **Servidor de Notificaciones:**
```javascript
// Ejemplo de envío de notificación
const sendPushNotification = async (token, title, body, data) => {
  const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Authorization': 'key=YOUR_SERVER_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: token,
      notification: {
        title: title,
        body: body
      },
      data: data
    })
  });
  
  return response.json();
};
```

## 📱 **Pruebas en dispositivos**

### **iOS:**
1. **Conectar iPhone** a Mac
2. **Seleccionar dispositivo** en Xcode
3. **Presionar Play** para instalar
4. **Confiar en certificado** en iPhone (Configuración > General > Gestión de dispositivos)

### **Android:**
1. **Conectar Android** a PC
2. **Habilitar depuración USB**
3. **Seleccionar dispositivo** en Android Studio
4. **Presionar Run** para instalar

## 🚀 **Publicación en tiendas**

### **App Store (iOS):**
1. **Configurar App Store Connect**
2. **Crear app** en App Store Connect
3. **Subir build** desde Xcode
4. **Revisar y publicar**

### **Google Play Store:**
1. **Configurar Google Play Console**
2. **Crear app** en Play Console
3. **Subir APK/AAB** desde Android Studio
4. **Revisar y publicar**

## 🔧 **Comandos útiles**

```bash
# Sincronizar cambios
npx cap sync

# Abrir iOS en Xcode
npx cap open ios

# Abrir Android en Android Studio
npx cap open android

# Construir para producción
npx cap build ios
npx cap build android

# Ejecutar en dispositivo
npx cap run ios
npx cap run android
```

## 📋 **Estructura del proyecto**
```
RutinaApp_Nueva/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
├── manifest.json       # Configuración PWA
├── package.json        # Dependencias Node.js
├── capacitor.config.ts # Configuración Capacitor
├── ios/                # Proyecto iOS (generado)
├── android/            # Proyecto Android (generado)
└── README.md           # Este archivo
```

## 🆘 **Solución de problemas**

### **Error común: "Capacitor not found"**
```bash
npm install @capacitor/core @capacitor/cli
npx cap sync
```

### **Error común: "Push notifications not working"**
1. **Verificar permisos** en dispositivo
2. **Verificar configuración** Firebase
3. **Verificar certificados** APNs (iOS)

### **Error común: "Build failed"**
1. **Limpiar proyecto** (Product > Clean Build Folder en Xcode)
2. **Sincronizar Capacitor** (`npx cap sync`)
3. **Verificar dependencias** (`npm install`)

## 📞 **Soporte**

Si tienes problemas:
1. **Revisar logs** en Xcode/Android Studio
2. **Verificar configuración** de certificados
3. **Consultar documentación** oficial de Capacitor
4. **Revisar requisitos** de sistema

## 🎯 **Próximos pasos**

1. **Instalar dependencias** con `npm install`
2. **Configurar Capacitor** con `npx cap init`
3. **Agregar plataformas** iOS y Android
4. **Configurar notificaciones** push con Firebase
5. **Probar en dispositivos** reales
6. **Publicar en tiendas** de aplicaciones

¡Tu app estará lista para iOS y Android con notificaciones push! 🎉
