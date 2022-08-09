import { IClient } from '../IClient';

export interface Lobby {
  name: string;
  id: string;
  maxClients: number;
  clients: IClient[];
}
