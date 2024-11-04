// src/app/core/models/machine.interface.ts
export interface Machine {
  id: number;
  name: string;
  status: 'active' | 'warning' | 'error';
  uptime: string;
  cpu: number;
  memory: {
    used: number;
    total: number;
  };
  disk: {
    used: number;
    total: number;
  };
  lastUpdate: string;
}

export interface MachineStats {
  total: number;
  active: number;
  warning: number;
  error: number;
}
