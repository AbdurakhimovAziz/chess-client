import { IClient } from '../IClient';

export interface Lobby {
  id: string;
  maxClients: number;
  clients: IClient[];
}
