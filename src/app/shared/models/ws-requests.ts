import { Colors } from './game/Colors';
import { UserDetails } from './user';

export interface WsMessage<T> {
  event: string;
  data: T;
}

export interface LobbyCreateDTO {
  name: string;
  maxClients: number;
  user: UserDetails;
  color?: Colors;
}

export interface LobbyJoinDTO {
  lobbyId: string;
  user: UserDetails;
}

export interface LobbyLeaveDTO extends LobbyJoinDTO {}
