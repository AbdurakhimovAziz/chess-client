import { Colors } from './game/Colors';
import { UserDetails } from './user';

export interface IClient {
  id: string;
  lobbyId: string | null;
  color: Colors;
  details: UserDetails;
}
