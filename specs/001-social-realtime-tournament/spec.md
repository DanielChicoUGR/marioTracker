# Feature Specification: Social, historial y torneo en vivo

**Feature Branch**: `001-social-realtime-tournament`  
**Created**: 2026-04-01  
**Status**: Draft  
**Input**: User description: "Quiero añádir un sistema de login amistad y historial así como que multiples personas que participan en el torneo puedan ver en tiempo real lo que está ocurriendo. La idea es usar supabase detras de todo ello para no tener que programar un backend"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cuenta e inicio de sesión (Priority: P1)

Una persona abre la aplicación, crea una cuenta o inicia sesión, y queda identificada de forma estable para el resto de funciones sociales y de torneo.

**Why this priority**: Sin identidad de usuario no hay amistades, historial personal ni trazabilidad de quién participa en el torneo en vivo.

**Independent Test**: Se puede validar creando una cuenta nueva, cerrando sesión e iniciando sesión de nuevo; el sistema reconoce al mismo usuario y mantiene su perfil mínimo visible para el propio usuario.

**Acceptance Scenarios**:

1. **Given** un visitante sin cuenta, **When** completa el registro con datos válidos, **Then** obtiene una sesión autenticada y ve confirmación de acceso.
2. **Given** un usuario registrado, **When** introduce credenciales correctas, **Then** accede a la aplicación sin errores de autenticación.
3. **Given** un usuario autenticado, **When** cierra sesión, **Then** deja de ver datos privados hasta volver a iniciar sesión.

---

### User Story 2 - Torneo visible en vivo para participantes (Priority: P2)

Varias personas participan en un mismo torneo y ven en tiempo real (o casi en tiempo real) el estado relevante: fase actual, resultados parciales, turnos o eventos acordados por el producto, sin tener que refrescar manualmente de forma constante.

**Why this priority**: Es el diferencial frente a un torneo “estático”; alinea expectativas de quienes siguen la competición.

**Independent Test**: Con al menos dos sesiones de usuario abiertas en el mismo torneo, una acción que cambie el estado del torneo se refleja para la otra en un intervalo corto y predecible, medible en pruebas de aceptación.

**Acceptance Scenarios**:

1. **Given** dos o más usuarios unidos al mismo torneo activo, **When** ocurre un cambio de estado autorizado (p. ej. nueva ronda o resultado registrado), **Then** todos ven el cambio reflejado sin intervención manual de cada uno más allá de estar conectados.
2. **Given** un usuario pierde la conexión brevemente, **When** vuelve a conectarse estando aún en el torneo, **Then** ve el estado actualizado del torneo.

---

### User Story 3 - Amistades entre usuarios (Priority: P3)

Un usuario puede enviar solicitudes de amistad, aceptarlas o rechazarlas, y ver una lista de amigos con los que el producto permita interacciones futuras (p. ej. invitar a torneos).

**Why this priority**: Refuerza retención y uso social; puede entregarse después de identidad y torneo en vivo si el calendario lo exige.

**Independent Test**: Dos cuentas de prueba intercambian solicitud y aceptación; ambas ven al otro en la lista de amigos tras aceptar.

**Acceptance Scenarios**:

1. **Given** dos usuarios autenticados, **When** uno envía solicitud de amistad al otro, **Then** el destinatario ve la solicitud pendiente.
2. **Given** una solicitud pendiente, **When** el destinatario acepta, **Then** ambos aparecen como amigos en sus respectivas listas.
3. **Given** una solicitud pendiente, **When** el destinatario rechaza, **Then** no se establece amistad y el solicitante recibe feedback acorde.

---

### User Story 4 - Historial de actividad y torneos (Priority: P4)

Un usuario autenticado consulta un historial de su participación: torneos recientes, resultados relevantes y marcas de tiempo, de forma que pueda revisar qué ocurrió sin depender solo de la vista en vivo.

**Why this priority**: Complementa el tiempo real con memoria consultable; útil para reclamaciones, orgullo y planificación.

**Independent Test**: Tras completar o abandonar un torneo, el usuario abre el historial y localiza esa entrada con datos coherentes con lo vivido en sesión.

**Acceptance Scenarios**:

1. **Given** un usuario que ha participado en al menos un torneo finalizado, **When** abre su historial, **Then** ve una lista ordenada con identificador del torneo y resultado o estado final comprensible.
2. **Given** un usuario sin historial previo, **When** abre la sección de historial, **Then** ve un estado vacío explicativo, no un error.

---

### Edge Cases

- Pérdida prolongada de conexión durante el torneo: el usuario debe ver mensaje claro y, al reconectar, estado coherente o indicación de que debe revalidar su participación.
- Intentos de acceso no autorizado a datos de otro usuario (historial, lista de amigos): el sistema no expone información ajena.
- Límite de solicitudes de amistad o spam: comportamiento definible (p. ej. bloqueo temporal) sin detallar implementación aquí.
- Concurrencia: dos operaciones que cambian el mismo estado del torneo deben resolverse de forma definida (p. ej. última escritura válida o reglas de negocio en planificación).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir registro de nuevas cuentas de usuario con validación de datos mínimos necesarios para identificación.
- **FR-002**: El sistema MUST permitir inicio y cierre de sesión de forma segura para cuentas existentes.
- **FR-003**: Los usuarios autenticados MUST poder enviar, aceptar y rechazar solicitudes de amistad, y ver el estado de las solicitudes recibidas.
- **FR-004**: Los usuarios autenticados MUST poder listar sus amigos confirmados.
- **FR-005**: El sistema MUST persistir y mostrar a cada usuario un historial de su participación en torneos y eventos relevantes definidos por el producto.
- **FR-006**: El sistema MUST propagar cambios de estado del torneo a todos los participantes autorizados de ese torneo de manera que la experiencia se perciba como “en vivo” (actualizaciones oportunas sin depender de recargar manualmente la página como único mecanismo).
- **FR-007**: El sistema MUST restringir datos personales, historial y relaciones sociales al propio usuario y a las partes autorizadas por las reglas de amistad y torneo.
- **FR-008**: El sistema MUST ofrecer retroalimentación clara ante errores de autenticación, fallos de red o estados inconsistentes del torneo.

### Non-Functional Requirements *(include when UX, performance, or quality constraints apply)*

Align with `.specify/memory/constitution.md`: UX consistency, performance budgets, and test/quality criteria when this feature affects them.

- **NFR-001**: La interfaz de login, amistades, historial y vista de torneo MUST usar patrones, terminología y estados de carga/error coherentes con el resto del producto MarioTracker.
- **NFR-002**: Las actualizaciones del torneo en vivo MUST ser perceptibles para el usuario en un tiempo acotado tras el evento (objetivo: la mayoría de los cambios visibles en menos de 5 segundos en condiciones de red normales), sin especificar tecnología aquí.
- **NFR-003**: Las funciones críticas (autenticación, visibilidad de datos, sincronización del torneo) MUST ser verificables mediante pruebas automatizadas o de contrato según el plan de calidad del proyecto.

### Key Entities *(include if feature involves data)*

- **Usuario**: Identidad de quien usa la aplicación; atributos mínimos de perfil acordados con el producto (p. ej. nombre visible).
- **Sesión de autenticación**: Asociación entre el usuario y el dispositivo/navegador hasta cierre de sesión o expiración.
- **Solicitud de amistad**: Relación pendiente entre dos usuarios con estados (enviada, aceptada, rechazada).
- **Amistad**: Relación confirmada entre dos usuarios.
- **Torneo**: Instancia de competición con participantes y estado evolutivo (fases, resultados).
- **Participante de torneo**: Vinculación usuario–torneo con rol o permisos para ver y actuar según reglas.
- **Entrada de historial**: Registro de un hecho relevante para el usuario (p. ej. torneo disputado, resultado, fecha).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Al menos el 90% de los usuarios de prueba completan registro e inicio de sesión correctamente en el primer intento con datos válidos (ensayo guiado con muestra definida en validación).
- **SC-002**: En condiciones de red estables, los participantes de un mismo torneo reciben actualizaciones del estado en un tiempo que el 95% de las veces no supera 5 segundos desde que el cambio queda registrado en el sistema (medido en pruebas de aceptación).
- **SC-003**: Al menos el 95% de las acciones de solicitud, aceptación y rechazo de amistad completadas sin error técnico en pruebas de regresión.
- **SC-004**: El 100% de las entradas de historial mostradas en pruebas de consistencia coinciden con los resultados o estados finales registrados para ese usuario en esos torneos.

## Assumptions

- Los usuarios cuentan con conexión a internet adecuada para autenticación y sincronización frecuente del torneo.
- No se requiere un servidor de aplicación propio: se asume uso de un **servicio gestionado (BaaS)** para autenticación, almacenamiento de datos y sincronización en tiempo real; el equipo concretará proveedor y políticas en la planificación técnica (decisión de producto: evitar un backend a medida).
- El alcance de “tiempo real” es de latencia humana aceptable para seguir un torneo, no de sistemas de trading de alta frecuencia.
- Los torneos y reglas de puntuación existentes o futuros del producto se integran con estas capacidades sin redefinir aquí el reglamento deportivo completo.
- Quienes solo “observan” un torneo están cubiertos como participantes autorizados o espectadores según las mismas reglas de acceso que defina el plan de producto (por defecto: acceso autenticado para reducir abuso).
