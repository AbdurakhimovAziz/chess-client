import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Colors } from 'src/app/shared/models/game/Colors';

@Component({
  selector: 'app-lobby-create-dialog',
  templateUrl: './lobby-create-dialog.component.html',
  styleUrls: ['./lobby-create-dialog.component.scss'],
})
export class LobbyCreateDialogComponent {
  public colorOptions: Colors[] = Object.values(Colors);

  public lobbyCreateForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    color: new FormControl(Colors.RANDOM, [Validators.required]),
  });

  get name() {
    return this.lobbyCreateForm.get('name');
  }
}
