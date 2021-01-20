import { Component, OnInit } from '@angular/core';

import {
  AngularFireDatabase,
  AngularFireList,
  SnapshotAction,
} from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Comment } from '../class/comment';
import { User } from '../class/user';

const CURRENT_USER: User = new User(1, '虫鹿 一貴');
const ANOTHER_USER: User = new User(2, '竹井 賢治');

@Component({
  selector: 'ac-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  comments$: Observable<Comment[]>;
  commentsRef: AngularFireList<Comment>;
  currentUser = CURRENT_USER;
  comment = '';

  constructor(private db: AngularFireDatabase) {
    this.commentsRef = db.list('/comments');
    this.comments$ = this.commentsRef.snapshotChanges().pipe(
      map((snapshots: SnapshotAction<Comment>[]) => {
        return snapshots.map((snapshot) => {
          const value = snapshot.payload.val();
          return new Comment({ key: snapshot.payload.key, ...value });
        });
      })
    );
  }

  ngOnInit(): void {}

  addComment(comment: string): void {
    if (comment) {
      this.commentsRef.push(
        new Comment({ user: this.currentUser, message: comment })
      );
      this.comment = '';
    }
  }

  updateComment(comment: Comment) {
    const { key, message } = comment;

    this.commentsRef.update(key, { message });
  }

  delete(comment: Comment) {
    this.commentsRef.remove(comment.key);
  }
}
