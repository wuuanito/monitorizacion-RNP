// src/app/core/services/machine.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Machine, MachineStats } from '../models/machine.interface';

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  private apiUrl = '/api/machines'; // Cambiar por tu URL real
  private machines = new BehaviorSubject<Machine[]>([]);
  machines$ = this.machines.asObservable();

  constructor(private http: HttpClient) {
    // Por ahora usamos datos mock
    this.machines.next(this.getMockMachines());
  }

  private getMockMachines(): Machine[] {
    return [
      {
        id: 1,
        name: 'Servidor-01',
        status: 'active',
        uptime: '5d 12h',
        cpu: 75,
        memory: { used: 8, total: 16 },
        disk: { used: 234, total: 500 },
        lastUpdate: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Servidor-02',
        status: 'warning',
        uptime: '2d 4h',
        cpu: 92,
        memory: { used: 14, total: 16 },
        disk: { used: 450, total: 500 },
        lastUpdate: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Servidor-03',
        status: 'error',
        uptime: '0d 1h',
        cpu: 0,
        memory: { used: 0, total: 16 },
        disk: { used: 234, total: 500 },
        lastUpdate: new Date().toISOString()
      }
    ];
  }

  getMachineStats(): MachineStats {
    const machines = this.machines.value;
    return {
      total: machines.length,
      active: machines.filter(m => m.status === 'active').length,
      warning: machines.filter(m => m.status === 'warning').length,
      error: machines.filter(m => m.status === 'error').length
    };
  }

  getMachine(id: number): Observable<Machine> {
    return this.http.get<Machine>(`${this.apiUrl}/${id}`);
  }

  addMachine(machine: Omit<Machine, 'id'>): void {
    const machines = this.machines.value;
    const newMachine = {
      ...machine,
      id: Math.max(...machines.map(m => m.id)) + 1
    };
    this.machines.next([...machines, newMachine]);
  }

  updateMachine(id: number, update: Partial<Machine>): void {
    const machines = this.machines.value;
    const index = machines.findIndex(m => m.id === id);
    if (index !== -1) {
      machines[index] = { ...machines[index], ...update };
      this.machines.next([...machines]);
    }
  }

  deleteMachine(id: number): void {
    const machines = this.machines.value;
    this.machines.next(machines.filter(m => m.id !== id));
  }
}
