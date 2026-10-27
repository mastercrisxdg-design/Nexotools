# NexoTools

Web responsive estática hecha con HTML, CSS y JavaScript. Incluye seis herramientas:
1. Calculadora de porcentajes, descuentos y aumentos.
2. Generador de códigos QR (usa QRCode.js desde CDN; requiere internet).
3. Contador de palabras, caracteres y frases aproximadas.
4. Formateador/validador JSON.
5. Generador de contraseñas con `crypto.getRandomValues`.
6. Conversor de longitud, masa y temperatura.

## Ejecutar en Windows
**Opción sencilla**
1. Descomprime `NexoTools.zip`.
2. Abre la carpeta `NexoTools`.
3. Haz doble clic en `index.html` para abrirla en Chrome o Edge.
4. Conexión a internet necesaria para las fuentes web y la herramienta QR; el resto funciona localmente.

**Recomendado para desarrollo con VS Code**
1. Instala Visual Studio Code.
2. En VS Code, selecciona Archivo > Abrir carpeta y elige `NexoTools`.
3. Instala la extensión "Live Server" si quieres recarga automática.
4. Haz clic derecho en `index.html` > "Open with Live Server".

## Publicar gratis con GitHub Pages
1. Crea una cuenta en GitHub y un repositorio nuevo, por ejemplo `nexotools`.
2. Sube los archivos de esta carpeta (`index.html`, `styles.css`, `script.js`, `privacy.html`, `terms.html`, `contact.html`).
3. En el repositorio, entra a Settings > Pages.
4. En Build and deployment, elige "Deploy from a branch", selecciona `main` y la carpeta `/ (root)`, y guarda.
5. Espera a que GitHub Pages publique el sitio. La URL será similar a `https://TU-USUARIO.github.io/nexotools/`.
6. Prueba las seis herramientas desde un móvil y una computadora.

También puedes usar un hosting estático como Cloudflare Pages o Netlify. Los pasos de interfaz pueden cambiar.

## Anuncios y Google AdSense
Los espacios con borde discontinuo son marcadores visuales, no anuncios activos. No generarán ingresos por sí solos.
1. Publica una web útil y original, con navegación y páginas legales revisadas.
2. Usa un dominio y completa los datos de tu sitio en Google AdSense si corresponde.
3. Espera la revisión y aprobación de Google; no está garantizada.
4. Cuando te aprueben, sigue las instrucciones oficiales de AdSense para verificar el sitio y añadir el script y los bloques de anuncios oficiales. No pegues códigos inventados ni hagas clic en tus propios anuncios.
5. Revisa las políticas de consentimiento/cookies aplicables a tus visitantes y a los servicios que uses. Actualiza la política de privacidad y añade información de contacto real.

## Antes de lanzar
- Sustituye el nombre si no tienes derecho a usarlo y verifica que el dominio esté disponible.
- Añade correo real en `contact.html`.
- Revisa y adapta los términos y la privacidad a tu implementación final.
- La herramienta QR depende de una librería CDN externa. Para producción, evalúa fijar una versión y alojar una copia propia con licencia revisada.
- Añade pruebas, analítica respetuosa con la privacidad y contenido explicativo original para cada herramienta.
- Las páginas legales de este starter son plantillas iniciales, no asesoría legal.
