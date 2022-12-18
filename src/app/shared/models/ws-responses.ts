import { Colors } from './game/Colors';
import { GameStatus } from './game/game-status';
import { Lobby } from './game/Lobby';

export interface LobbyCreateResponse {
  hostColor: Colors;
  lobby: Lobby;
  message: string;
}

export interface LobbyJoinResponse extends LobbyLeaveResponse {
  color: Colors;
  gameStatus: GameStatus;
}

export interface LobbyLeaveResponse {
  lobbyId: string;
  message: string;
}
