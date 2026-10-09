/**
 * Helper to determine teacher tint and header band color.
 * Matches program name case-insensitively, defaulting to 'yellow'.
 */
export function getTeacherTint(teacher, programs = []) {
  if (!teacher || !teacher.program) return 'yellow';
  const progName = teacher.program.trim().toLowerCase();
  const match = programs.find((p) => p.name.trim().toLowerCase() === progName);
  return match ? match.tint : 'yellow';
}

export function getTeacherHeaderColor(tint) {
  const map = {
    yellow: 'var(--sunny)',
    pink: 'var(--bubblegum)',
    mint: 'var(--meadow)',
    sky: 'var(--sky)',
    grape: 'var(--grape)',
    lilac: 'var(--tint-lilac)',
  };
  return map[tint] || 'var(--sunny)';
}
