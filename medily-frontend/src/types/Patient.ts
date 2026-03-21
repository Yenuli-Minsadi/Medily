export interface Patient {
  id: string;
  name: string;
  lastMsg: string;
  status: "online" | "offline";
  initials: string;
}

export interface Message {
  id: string;
  text: string;
  sender: "doctor" | "patient";
  time: string;
}

export interface VitalSigns {
  bloodPressure: string;
  heartRate: number;
  bloodSugar: number;
  bmi: number;
}

