import { Injectable, OnDestroy } from '@angular/core';
import {
  webSocket,
  WebSocketSubject,
  WebSocketSubjectConfig,
} from 'rxjs/webSocket';
import {
  distinctUntilChanged,
  EMPTY,
  filter,
  interval,
  map,
  Observable,
  Observer,
  share,
  Subject,
  SubscriptionLike,
  takeWhile,
} from 'rxjs';
import { WS_ENDPOINT } from '../constants';
import { WsMessage } from '../models/ws-requests';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService implements OnDestroy {
  private config: WebSocketSubjectConfig<WsMessage<any>>;

  private websocketSub: SubscriptionLike;
  private statusSub: SubscriptionLike;

  private reconnection$: Observable<number> | null = null;
  private websocket$: WebSocketSubject<WsMessage<any>> | null = null;
  private connection$!: Observer<boolean>;
  private WsMessages$: Subject<WsMessage<any>>;

  private reconnectInterval: number;
  private reconnectAttempts: number;
  private isConnected: boolean = false;

  public status: Observable<boolean>;

  constructor() {
    this.WsMessages$ = new Subject<WsMessage<any>>();

    this.reconnectInterval = 5000;
    this.reconnectAttempts = 10;

    this.config = {
      url: WS_ENDPOINT,
      closeObserver: {
        next: (event: CloseEvent) => {
          this.websocket$ = null;
          this.connection$.next(false);
        },
      },
      openObserver: {
        next: (event: Event) => {
          console.log('WebSocket connected!');
          this.connection$.next(true);
        },
      },
    };

    this.status = new Observable<boolean>((observer) => {
      this.connection$ = observer;
    }).pipe(share(), distinctUntilChanged());

    this.statusSub = this.status.subscribe((isConnected) => {
      this.isConnected = isConnected;

      if (
        !this.reconnection$ &&
        typeof isConnected === 'boolean' &&
        !isConnected
      ) {
        this.reconnect();
      }
    });

    this.websocketSub = this.WsMessages$.subscribe({
      error: (error: ErrorEvent) => console.error('WebSocket error!', error),
    });

    // this.connect();
  }

  public connect() {
    this.websocket$ = new WebSocketSubject(this.config);

    this.websocket$.subscribe({
      next: (message) => this.WsMessages$.next(message),
      error: () => {
        if (!this.websocket$) {
          this.reconnect();
        }
      },
      complete: () => {
        console.log('WebSocket disconnected!');
      },
    });
  }

  private reconnect(): void {
    this.reconnection$ = interval(this.reconnectInterval).pipe(
      takeWhile(
        (_, index) => index < this.reconnectAttempts && !this.websocket$
      )
    );

    this.reconnection$.subscribe({
      next: () => this.connect(),
      complete: () => {
        this.reconnection$ = null;

        if (!this.websocket$) {
          this.WsMessages$.complete();
          this.connection$.complete();
        }
      },
    });
  }

  public on<T>(event: string): Observable<T> {
    return event
      ? this.WsMessages$.pipe(
          filter((message: WsMessage<T>) => message.event === event),
          map((message: WsMessage<T>) => message.data)
        )
      : EMPTY;
  }

  public send<T>(event: string, data?: T): void {
    if (event && this.isConnected && this.websocket$) {
      this.websocket$.next({ event, data });
    } else {
      this.reconnect();
    }
  }

  public disconnect(): void {
    this.websocket$?.complete();
  }

  public disconnection(): void {
    this.websocket$?.complete();
  }

  ngOnDestroy(): void {
    this.websocketSub.unsubscribe();
    this.statusSub.unsubscribe();
  }
}
