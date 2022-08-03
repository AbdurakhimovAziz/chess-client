import { Colors } from './game/Colors';
import { Lobby } from './game/Lobby';

export interface LobbyCreateResponse {
  hostColor: Colors;
  lobby: Lobby;
  message: string;
}

export interface LobbyJoinResponse extends LobbyLeaveResponse {
  color: Colors;
}

export interface LobbyLeaveResponse {
  lobbyId: string;
  message: string;
}
