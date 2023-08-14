import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  
  private apiUrl = 'http://localhost:5035/api/player'; 
  private apiUrlT = 'http://localhost:5035/api/game/simulate';

  constructor(private http: HttpClient) { }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl);
  }

  setTeam(teamData: Team): Observable<Player[]> {
    return this.http.post<Player[]>(this.apiUrlT, teamData);
}
}

export interface Player {
  id: number;
  name: string;
  imagePath: string;
  attack: number;
  support: number;
  defence: number;
  position: number;
  skilllevel: number;
}

export interface Team {
  id: number;
  teamName: string;
  players: Player[];
}
