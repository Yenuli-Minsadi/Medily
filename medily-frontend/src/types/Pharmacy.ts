export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  phone: string;
  open: boolean;
  availableMeds: string[];
  matchScore: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  threshold: number;
  expiresAt: string;
  supplier: string;
}

export interface NearbyPatient {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  distance: string;
  distanceKm: number;
  prescription: string;
  requestedAt: string;
  status: "searching" | "matched" | "en_route";
}

export interface NearbyStatusConfig {
  label: string;
  classes: string;
}
