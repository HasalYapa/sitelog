export interface WorkforceData {
  category: string;
  count: number;
  color: string;
}

export interface MachineryData {
  id: string;
  name: string;
  status: 'Active' | 'Idle' | 'Maintenance';
  hours: number;
  startTime?: string;
  endTime?: string;
}

export interface RainData {
  day: string;
  rain: number;
}
