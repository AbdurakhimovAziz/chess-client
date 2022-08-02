import { Component, OnInit } from '@angular/core';
import { Events } from 'src/app/shared/models/events';
import { Lobby } from 'src/app/shared/models/game/lobby';
import { LobbyCreateResponse } from 'src/app/shared/models/ws-responses';
import { UsersService } from 'src/app/shared/services/user.service';
import { WebsocketService } from 'src/app/shared/services/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public lobbies: Lobby[] = [];

  constructor(
    private wsService: WebsocketService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.wsService.connect();
    this.wsService.status.subscribe((status) => {
      if (status) {
        this.getAllLobbies();
      }
    }),
      this.wsService
        .on<Lobby[]>(Events.LOBBY_LIST)
        .subscribe((data: Lobby[]) => {
          this.lobbies = data;
          console.log(this.lobbies);
        });

    this.wsService
      .on<LobbyCreateResponse>(Events.LOBBY_CREATE)
      .subscribe((data: LobbyCreateResponse) => {
        this.lobbies.push(data.lobby);
        console.log(this.lobbies);
      });
  }

  public createLobby(): void {
    const userId = this.userService.getId();
    this.wsService.send(Events.LOBBY_CREATE, {
      maxClients: 2,
      userId,
    });
  }

  public getAllLobbies(): void {
    this.wsService.send(Events.LOBBY_LIST);
  }
}
