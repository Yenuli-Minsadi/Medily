// ─── Status Config ──────────────────────────────────────────────────────────────
export const statusConfig: Record<
  PrescriptionStatus,
  { label: string; classes: string; dot: string }
> = {
  pending: {
    label: "Pending",
    classes: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
  },
  accepted: {
    label: "Accepted",
    classes: "bg-teal-50 text-teal-700 border border-teal-200",
    dot: "bg-teal-400",
  },
  dispensed: {
    label: "Dispensed",
    classes: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
  },
  rejected: {
    label: "Rejected",
    classes: "bg-red-50 text-red-600 border border-red-200",
    dot: "bg-red-400",
  },
};

export const nearbyStatusConfig = {
  searching: {
    label: "Searching nearby",
    classes: "text-sky-600 bg-sky-50 border border-sky-200",
  },
  matched: {
    label: "Matched",
    classes: "text-teal-600 bg-teal-50 border border-teal-200",
  },
  en_route: {
    label: "En Route",
    classes: "text-violet-600 bg-violet-50 border border-violet-200",
  },
};
