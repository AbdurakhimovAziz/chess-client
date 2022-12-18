import { Component, Input } from '@angular/core';
import { Events } from 'src/app/shared/models/events';
import { LobbyJoinDTO } from 'src/app/shared/models/ws-requests';
import { UsersService } from 'src/app/shared/services/user.service';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import { Lobby } from '../../shared/models/game/Lobby';

@Component({
  selector: 'app-lobby-item',
  templateUrl: './lobby-item.component.html',
  styleUrls: ['./lobby-item.component.scss'],
})
export class LobbyItemComponent {
  @Input() lobby!: Lobby;

  constructor(
    private wsService: WebsocketService,
    private userService: UsersService
  ) {}

  public joinLobby(): void {
    const user = this.userService.getUser();
    if (!user) return;
    this.wsService.send<LobbyJoinDTO>(Events.LOBBY_JOIN, {
      lobbyId: this.lobby.id,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  }
}
