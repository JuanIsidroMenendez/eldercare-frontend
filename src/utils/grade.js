// Refactorización de GradeBadge.vue.
const GRADE_META = {
  GRADO_I: { label: "Grado I - Leve", classes: "bg-grade-1/15 text-grade-1" },
  GRADO_II: { label: "Grado II - Moderada", classes: "bg-grade-2/15 text-grade-2" },
  GRADO_III: { label: "Grado III - Severa", classes: "bg-grade-3/15 text-grade-3" },
};

export function gradeLabel(grade) {
  return GRADE_META[grade]?.label ?? grade;
}

export function gradeClasses(grade) {
  return GRADE_META[grade]?.classes ?? "bg-border text-text-muted";
}