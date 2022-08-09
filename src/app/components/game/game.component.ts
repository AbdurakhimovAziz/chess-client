import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Events } from 'src/app/shared/models/events';
import { Board } from 'src/app/shared/models/game/Board';
import { Colors } from 'src/app/shared/models/game/Colors';
import { King } from 'src/app/shared/models/game/figures/King';
import { Pawn } from 'src/app/shared/models/game/figures/Pawn';
import { Rook } from 'src/app/shared/models/game/figures/Rook';
import { GameMode } from 'src/app/shared/models/game/game-mode';
import { GameStatus } from 'src/app/shared/models/game/game-status';
import { Lobby } from 'src/app/shared/models/game/Lobby';
import { Move } from 'src/app/shared/models/game/Move';
import { Player } from 'src/app/shared/models/game/Player';
import { GameViewService } from 'src/app/shared/services/game-view.service';
import { GameService } from 'src/app/shared/services/game.service';
import { MoveSimulatorService } from 'src/app/shared/services/move-simulator.service';
import { MoveService } from 'src/app/shared/services/move.service';
import { UsersService } from 'src/app/shared/services/user.service';
import { WebsocketService } from 'src/app/shared/services/websocket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  public board!: Board;
  private currentPlayer!: Player;
  private whiteKing: King | null = null;
  private blackKing: King | null = null;

  private subsriptions: Subscription[] = [];
  private lobbyId: string | null = null;

  constructor(
    private gameService: GameService,
    private gameViewService: GameViewService,
    private moveService: MoveService,
    private moveSimulatorService: MoveSimulatorService,
    private userService: UsersService,
    private wsService: WebsocketService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.lobbyId = this.route.snapshot.queryParamMap.get('lobbyId');

    this.board = this.gameService.getBoard();
    this.moveSimulatorService.setBoardCopy(this.board);

    this.whiteKing = this.board.getKing(Colors.WHITE);
    this.blackKing = this.board.getKing(Colors.BLACK);

    const gameMode = this.gameService.getGameMode();
    gameMode === GameMode.LOCAL &&
      this.gameService.setGameStatus(GameStatus.IN_PROGRESS);

    this.addSubscription(
      this.wsService.on<Move>(Events.MOVE).subscribe((data: Move) => {
        this.gameViewService.setActiveCell(null);
        const move = new Move(
          this.currentPlayer,
          this.board,
          data.start,
          data.end
        );
        this.gameService.processMove(move);
      })
    );

    this.addSubscription(
      this.wsService
        .on<{ gameStatus: GameStatus; lobby: Lobby }>(Events.GAME_STATUS)
        .subscribe((data) => {
          const { gameStatus, lobby } = data;
          this.gameService.setGameStatus(gameStatus);
          if (gameStatus === GameStatus.IN_PROGRESS) {
            lobby.clients.forEach((client) => {
              const name =
                client.details.firstName + ' ' + client.details.lastName;
              this.gameService.setPlayerName(client.color, name);
            });
          }
        })
    );

    this.addSubscription(
      this.gameViewService.activeCell$.subscribe((cell) =>
        this.gameViewService.highlightCells(cell)
      )
    );

    this.addSubscription(
      this.gameService.currentPlayer$.subscribe(
        (player) => (this.currentPlayer = player)
      )
    );

    this.addSubscription(
      this.moveService.lastMove$.subscribe((move: Move) => {
        this.gameService.swapCurrentPlayer();

        if (this.gameService.getGameMode() === GameMode.LOCAL) {
          this.gameService.rotateBoard();
        }

        const figure = move.getMoveedFigure();
        if (
          figure instanceof Pawn ||
          figure instanceof King ||
          figure instanceof Rook
        ) {
          !figure.isMoved() && figure.setMoved(true);
        }

        const figures = this.board.getFigures();
        this.board.setFigures(
          figures.filter((figure) => figure !== move.getCapturedFigure())
        );

        this.moveSimulatorService.setBoardCopy(this.board);

        this.whiteKing?.setInCheck(
          this.gameService.isKingInCheck(this.board, this.whiteKing)
        );
        this.blackKing?.setInCheck(
          this.gameService.isKingInCheck(this.board, this.blackKing)
        );

        this.gameService.checkEnpassant(move);
        this.checkGameOver();
      })
    );
  }

  public isBoardRotated(): boolean {
    return this.gameService.isBoardRotated();
  }

  private checkGameOver(): void {
    const stalemate = this.gameService.isStalemate(this.currentPlayer.color);

    if (stalemate) {
      const king =
        this.currentPlayer.color === Colors.WHITE
          ? this.whiteKing
          : this.blackKing;
      if (king?.isInCheck) console.log('checkmate');
      else console.log('stalemate. DRAW!');
    }
  }

  public getGameStatus(): GameStatus {
    return this.gameService.getGameStatus();
  }

  public getPlayers(): [Player, Player] {
    const color =
      this.gameService.getGameMode() === GameMode.ONLINE
        ? this.gameService.getOnlinePlayerColor()!
        : Colors.WHITE;

    return [
      this.gameService.getPlayer(color),
      this.gameService.getOpponentPlayer(color),
    ];
  }

  public isGameStarted(): boolean {
    return this.gameService.getGameStatus() === GameStatus.IN_PROGRESS;
  }

  private addSubscription(subscription: Subscription): void {
    this.subsriptions.push(subscription);
  }

  public leaveLobby(): void {
    const user = this.userService.getUser();
    user &&
      this.wsService.send(Events.LOBBY_LEAVE, {
        lobbyId: this.lobbyId,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
  }

  public onLeave(): void {
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    this.subsriptions.forEach((subscription) => subscription.unsubscribe());
    this.gameService.restart();
    this.leaveLobby();
  }
}
