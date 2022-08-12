import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { GameMode } from 'src/app/shared/models/game/game-mode';
import { LobbyCreateDTO } from 'src/app/shared/models/ws-requests';
import { GameService } from 'src/app/shared/services/game.service';
import { Events } from '../../shared/models/events';
import { Lobby } from '../../shared/models/game/Lobby';
import {
  LobbyCreateResponse,
  LobbyJoinResponse,
} from '../../shared/models/ws-responses';
import { UsersService } from '../../shared/services/user.service';
import { WebsocketService } from '../../shared/services/websocket.service';
import { LobbyCreateDialogComponent } from './lobby-create-dialog/lobby-create-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public lobbies: Lobby[] = [];
  public user$ = this.userService.user$;

  private subsriptions: Subscription[] = [];

  constructor(
    private gameService: GameService,
    private wsService: WebsocketService,
    private userService: UsersService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.addSubscription(
      this.wsService.status.subscribe((status) => {
        if (status) {
          this.getAllLobbies();
        }
      })
    );

    this.addSubscription(
      this.wsService
        .on<Lobby[]>(Events.LOBBY_LIST)
        .subscribe((data: Lobby[]) => {
          this.lobbies = data;
        })
    );

    this.addSubscription(
      this.wsService
        .on<LobbyCreateResponse>(Events.LOBBY_CREATE)
        .subscribe((data: LobbyCreateResponse) => {
          const { id: lobbyId } = data.lobby;

          this.gameService.changeGameMode(GameMode.ONLINE, data.hostColor);
          this.router.navigate(['/game'], { queryParams: { lobbyId } });
        })
    );

    this.addSubscription(
      this.wsService
        .on<LobbyJoinResponse>(Events.LOBBY_JOIN)
        .subscribe((data: LobbyJoinResponse) => {
          const { lobbyId, color } = data;
          this.gameService.changeGameMode(GameMode.ONLINE, color);
          this.router.navigate(['/game'], { queryParams: { lobbyId } });
        })
    );
  }

  public createLobby(): void {
    const dialogRef = this.dialog.open(LobbyCreateDialogComponent, {
      width: '500px',
      height: '500px',
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (!data) return;
      const user = this.userService.getUser();
      if (!user) return;
      this.wsService.send<LobbyCreateDTO>(Events.LOBBY_CREATE, {
        maxClients: 2,
        name: data.name,
        color: data.color,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    });
  }

  public getAllLobbies(): void {
    this.wsService.send(Events.LOBBY_LIST);
  }

  public logout(): void {
    this.authService.logout();
  }

  private addSubscription(subscription: Subscription): void {
    this.subsriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.subsriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
