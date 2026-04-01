# Contrato: expectativas de RLS

Todas las tablas en `public` con datos de usuario o torneo **tienen RLS habilitado**. Ningún flujo de aplicación debe depender de lecturas sin sesión si el dato es privado.

## Roles

- **anon**: solo operaciones permitidas explícitamente (p. ej. ninguna fila sensible sin auth).
- **authenticated**: sujeto a políticas por tabla.

## Tablas y reglas mínimas

| Tabla | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | propio | propio (crear perfil) | propio | opcional según producto |
| friend_requests | involucrados | solicitante autenticado | destinatario (estado) | según política de cancelación |
| friendships | miembros del par | vía RPC/trigger | — | — |
| tournaments | participantes del torneo | organizadores / flujo definido | según rol | según rol |
| tournament_participants | coparticipantes / propio | unión al torneo según reglas | según reglas | según reglas |
| tournament_events | quien pueda ver el torneo | según rol | — | opcional |

## Verificación

- Pruebas manuales con dos usuarios JWT y comprobación de que A no lee datos privados de B fuera de amistad/torneo compartido.
- Migraciones SQL revisadas en PR antes de merge.
