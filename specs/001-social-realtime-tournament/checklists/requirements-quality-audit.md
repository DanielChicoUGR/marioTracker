# Requirements Quality Audit: Social, historial y torneo en vivo

**Purpose**: Validar la calidad, claridad y completitud de los requisitos escritos (no la implementación).  
**Created**: 2026-04-01  
**Feature**: [spec.md](../spec.md)

**Note**: Generado por `/speckit.checklist` sin dominio explícito en la invocación; foco en auth, torneo en vivo, amistades e historial según la spec.

## Requirement Completeness

- [ ] CHK001 ¿Están definidos los datos mínimos obligatorios en registro más allá de “identificación” genérica? [Completeness, Gap, Spec §FR-001]
- [ ] CHK002 ¿La spec delimita qué cuenta como “eventos relevantes” del historial frente a cualquier evento técnico? [Completeness, Spec §FR-005, Key Entities · Entrada de historial]
- [ ] CHK003 ¿Las reglas de “participantes autorizados” del torneo en vivo están descritas con el mismo detalle que las historias de usuario? [Completeness, Gap, Spec §FR-006, US2]

## Requirement Clarity

- [ ] CHK004 ¿“Validación de datos mínimos” en FR-001 es lo bastante específica para evitar interpretaciones contradictorias entre equipos? [Clarity, Spec §FR-001]
- [ ] CHK005 ¿“Intervalo corto y predecible” en la historia US2 está alineado cuantitativamente con NFR-002 (< 5 s) o existe riesgo de doble definición de latencia? [Clarity, Consistency, Spec §User Story 2 Independent Test vs NFR-002]
- [ ] CHK006 ¿“Feedback acorde” ante rechazo de amistad (US3) tiene criterios observables o permanece subjetivo? [Clarity, Spec §US3 escenario 3]
- [ ] CHK007 ¿“Oportunas” en FR-006 está acotado sin depender solo de NFR-002? [Clarity, Spec §FR-006, NFR-002]

## Requirement Consistency

- [ ] CHK008 ¿Los estados de solicitud de amistad en entidades (“enviada, aceptada, rechazada”) son coherentes con la redacción de US3 y FR-003? [Consistency, Spec §Key Entities · Solicitud de amistad, §FR-003]
- [ ] CHK009 ¿El rol de participante (jugador vs espectador vs organizador implícito) está alineado entre historias, entidades y FR-006/FR-007? [Consistency, Gap, Spec §Participante de torneo, US2]

## Acceptance Criteria Quality

- [ ] CHK010 ¿SC-001 define tamaño de muestra y criterio de “primer intento” de forma que pueda auditarse sin nueva negociación? [Measurability, Spec §SC-001]
- [ ] CHK011 ¿“Cambio queda registrado en el sistema” en SC-002 es trazable a un requisito funcional explícito de registro de estado? [Traceability, Spec §SC-002, FR-006]
- [ ] CHK012 ¿SC-003 y SC-004 especifican el universo de pruebas (entornos, datos semilla) o dependen de supuestos no documentados? [Measurability, Gap, Spec §SC-003, SC-004]

## Scenario Coverage

- [ ] CHK013 ¿Hay requisitos explícitos para el flujo “organizar torneo / unirse por enlace” o solo se infiere de participantes y torneo activo? [Coverage, Gap, Spec §US2, Assumptions]
- [ ] CHK014 ¿Las necesidades de quienes “solo observan” (Assumptions último bullet) están reflejadas en FR o historias con criterios de aceptación? [Coverage, Spec §Assumptions, §FR-007]
- [ ] CHK015 ¿El abandono de torneo frente a “finalizado” está cubierto en requisitos además del independent test de US4? [Coverage, Edge Case, Spec §US4]

## Edge Case Coverage

- [ ] CHK016 ¿“Pérdida prolongada de conexión” (Edge Cases) tiene umbral temporal o severidad definidos en requisitos, o solo narrativa? [Clarity, Gap, Spec §Edge Cases línea 1]
- [ ] CHK017 ¿“Concurrencia” en estado del torneo enlaza con un criterio de aceptación o SC medible, o queda solo como expectativa de planificación? [Traceability, Gap, Spec §Edge Cases concurrencia]
- [ ] CHK018 ¿Anti-spam de amistad (Edge Cases) tiene requisitos de producto mínimos (p. ej. límites) o se acepta exclusivamente como decisión de implementación? [Completeness, Spec §Edge Cases spam]

## Non-Functional Requirements

- [ ] CHK019 ¿NFR-003 (“verificables mediante pruebas automatizadas o de contrato”) define qué funciones son “críticas” con la misma granularidad que FR-007/FR-008? [Clarity, Spec §NFR-003]
- [ ] CHK020 ¿NFR-001 permite verificar coherencia de UX entre módulos sin referencia a un sistema de diseño o glosario de términos? [Measurability, Gap, Spec §NFR-001]

## Dependencies & Assumptions

- [ ] CHK021 ¿La asunción de BaaS (Assumptions) está reconciliada con la ausencia de requisitos de portabilidad entre proveedores si el producto cambia de stack? [Assumption, Spec §Assumptions BaaS]
- [ ] CHK022 ¿“Reglas de puntuación existentes o futuros del producto” (Assumptions) introduce dependencia no acotada en FR de historial/torneo? [Dependency, Risk, Spec §Assumptions reglamento]

## Ambiguities & Conflicts

- [ ] CHK023 ¿Existe ambigüedad entre “tiempo real” coloquial en US2 y el límite de 5 s en NFR-002 para litigios de cumplimiento? [Ambiguity, Spec §US2, NFR-002]
- [ ] CHK024 ¿“Partes autorizadas por las reglas de amistad y torneo” (FR-007) requiere un documento de reglas referenciado para evitar conflictos con FR-003/FR-004? [Conflict risk, Gap, Spec §FR-007]

## Notes

- Ítems con `[Gap]` indican huecos potenciales en la redacción de requisitos, no fallos de código.
- Marcar `[x]` cuando el requisito correspondiente se refine en `spec.md` o se documente la exclusión explícita.
- Trazabilidad: referencias a `Spec §` apuntan a [spec.md](../spec.md).
