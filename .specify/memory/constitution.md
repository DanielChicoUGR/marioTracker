<!--
Sync Impact Report
- Version change: (template) → 1.0.0
- Principles: nueva adopción — I. Calidad y mantenibilidad del código; II. Estándares de pruebas;
  III. Consistencia de experiencia de usuario; IV. Requisitos de rendimiento
- Secciones añadidas: Tooling y umbrales de calidad; Flujo de desarrollo y cumplimiento
- Secciones eliminadas: ninguna (plantilla genérica sustituida por contenido concreto)
- Plantillas: .specify/templates/plan-template.md ✅ | .specify/templates/spec-template.md ✅ |
  .specify/templates/tasks-template.md ✅ | .specify/templates/checklist-template.md ✅ |
  .specify/templates/commands/*.md — sin carpeta; N/A | .specify/templates/agent-file-template.md — sin cambio
- Seguimiento: ningún TODO diferido
-->

# MarioTracker Constitution

## Core Principles

### I. Calidad y mantenibilidad del código

El código MUST ser legible, cohesivo y fácil de cambiar. Las contribuciones MUST seguir el estilo
acordado del repositorio (formateo, lint, convenciones de nombres) y MUST mantener o mejorar la
claridad: funciones y módulos con responsabilidad única, dependencias explícitas, y errores
manejados de forma predecible. La complejidad accidental MUST justificarse en plan o revisión;
YAGNI y el principio de menor sorpresa guían las decisiones por defecto.

**Rationale**: La deuda técnica invisible ralentiza el producto y multiplica errores; la calidad
estructural es un requisito, no un extra opcional al final del sprint.

### II. Estándares de pruebas

Las funcionalidades críticas y los contratos públicos (APIs, esquemas, límites de módulos) MUST
tener cobertura de pruebas automatizadas acorde al riesgo: unitarias para lógica pura; integración
donde hay I/O, persistencia o fronteras entre componentes; regresión para fallos corregidos. Los
cambios que rompan comportamiento esperado MUST actualizar pruebas en el mismo cambio o justificar
la excepción. Las pruebas MUST ser deterministas y aisladas de red/servicios externos salvo en
suites explícitas de integración.

**Rationale**: Sin estándar de pruebas, los refactors y releases son apuestas; las pruebas son la
red de seguridad que hace viable iterar con confianza.

### III. Consistencia de experiencia de usuario

La interfaz (CLI, web, móvil o lo que aplique) MUST ser coherente: patrones de interacción,
terminología, feedback de errores, estados de carga y accesibilidad mínima alineados con el
diseño o guía del proyecto. Los flujos nuevos MUST reutilizar componentes o patrones existentes
salvo decisión documentada de introducir una variante. Los textos orientados al usuario MUST ser
claros y revisables (sin jerga interna innecesaria).

**Rationale**: La inconsistencia aumenta la carga cognitiva, los errores de uso y el coste de
soporte; la UX uniforme es parte de la calidad del producto.

### IV. Requisitos de rendimiento

Cada feature MUST definir presupuestos de rendimiento relevantes (latencia p95/p99, uso de CPU o
memoria, fps en UI, throughput, etc.) en especificación o plan, o heredar límites explícitos del
dominio. Las implementaciones MUST evitar regresiones medibles frente a esos presupuestes; si no
es posible, MUST documentarse la desviación y el plan de mitigación. El trabajo costoso MUST
perfilar o medirse antes de micro-optimizar.

**Rationale**: El rendimiento es un requisito funcional para muchos usuarios; definirlo tarde o
solo en producción es caro y arriesgado.

## Tooling y umbrales de calidad

El proyecto MUST ejecutar en CI (o localmente antes de merge, si no hay CI) las comprobaciones
acordadas: lint, formato, typecheck cuando aplique, y la suite de pruebas relevante. Los merges
MUST bloquearse si fallan estas comprobaciones salvo excepción aprobada y registrada. Los logs y
errores orientados a operadores MUST ser estructurados o localizables cuando el stack lo permita.

## Flujo de desarrollo y cumplimiento

Las especificaciones e implementaciones MUST trazarse a estos principios: los planes MUST incluir
una comprobación explícita frente a la constitución (véase plantilla de plan). Las revisiones de
código MUST verificar calidad, pruebas, UX y riesgo de rendimiento según el alcance del cambio.
Las desviaciones MUST documentarse en seguimiento de complejidad o en el artefacto de especificación
correspondiente.

## Governance

Esta constitución tiene precedencia sobre prácticas ad hoc no documentadas. Las enmiendas MUST
actualizar la versión según semver: MAJOR si se eliminan o redefinen principios de forma
incompatible; MINOR si se añaden principios o se amplía sustancialmente la guía; PATCH para
aclaraciones y correcciones sin cambio de significado. Cada revisión periódica o antes de releases
mayores SHOULD comprobar alineación con `.specify/memory/constitution.md`. La guía de desarrollo
en el repositorio (p. ej. README o `docs/`) SHOULD referenciar esta constitución cuando exista.

**Version**: 1.0.0 | **Ratified**: 2026-04-01 | **Last Amended**: 2026-04-01
