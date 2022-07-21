import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Board } from 'src/app/shared/models/game/Board';
import { Colors } from 'src/app/shared/models/game/Colors';
import { King } from 'src/app/shared/models/game/figures/King';
import { Move } from 'src/app/shared/models/game/Move';
import { Player } from 'src/app/shared/models/game/Player';
import { GameViewService } from 'src/app/shared/services/game-view.service';
import { GameService } from 'src/app/shared/services/game.service';
import { MoveSimulatorService } from 'src/app/shared/services/move-simulator.service';
import { MoveService } from 'src/app/shared/services/move.service';

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

  constructor(
    private gameService: GameService,
    private gameViewService: GameViewService,
    private moveService: MoveService,
    private moveSimulatorService: MoveSimulatorService
  ) {}

  ngOnInit(): void {
    this.board = this.gameService.getBoard();
    this.moveSimulatorService.setCopyBoard(this.board);
    this.whiteKing = this.board.getKing(Colors.WHITE);
    this.blackKing = this.board.getKing(Colors.BLACK);

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
      this.moveService.lastMove$.subscribe((move) => {
        this.gameService.swapCurrentPlayer();
      })
    );

    this.addSubscription(
      this.moveService.lastMove$.subscribe((move: Move | null) => {
        this.moveSimulatorService.setCopyBoard(this.board);

        this.whiteKing?.setInCheck(
          this.gameService.isKingUderCheck(this.board, this.whiteKing)
        );
        this.blackKing?.setInCheck(
          this.gameService.isKingUderCheck(this.board, this.blackKing)
        );

        this.gameService.checkEnpassant(move);
      })
    );
  }

  private addSubscription(subscription: Subscription): void {
    this.subsriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.subsriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
