import { Player } from './Player';

export interface Lobby {
  id: string;
  maxClients: number;
  clients: Player[];
}
