import { Component } from '@angular/core';
import { Buffer } from 'buffer';
import * as URLSafeBase64 from 'urlsafe-base64';
import { createHmac} from 'crypto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'jwt-ui';
  options = ['first', 'second', 'third'];
  optionContentMap: Map<string, string> = new Map<string, string>();
  selected: string = '';
  content: string | undefined = '';
  secret = '';
  resultToken: string = 'none';
  base64encoded: boolean = true;

  ngOnInit() {
    this.optionContentMap.set('first', '{"test1":"result1"}');
    this.optionContentMap.set('second', '{"test2":"result2"}');
    this.optionContentMap.set('third', '{"test3":"result3"}');
  }

  getContent(): string | undefined {
    if (!this.content) {
        this.content = this.optionContentMap.get(this.selected);
    }
    return this.optionContentMap.get(this.selected);
  }

  generate() {
    if (this.content !== undefined) {
      let header = '{"alg":"HS256","typ":"JWT"}';
      let headerEncoded = URLSafeBase64.encode(Buffer.from(header));
      let payloadEncoded = URLSafeBase64.encode(Buffer.from(this.stripSpacing(this.content)));
      let signatureEncoded = this.getSignedStringBase64(headerEncoded, payloadEncoded);
      this.resultToken = `${headerEncoded}.${payloadEncoded}.${signatureEncoded}`;
    }
  }

  getSignedStringBase64(header: string, payload: string): string {
    let decodedSecret = '';
    if (this.base64encoded === true) {
        decodedSecret = Buffer.from(this.stripSpacing(this.secret), 'base64').toString('ascii');
    } else {
        decodedSecret = this.stripSpacing(this.secret);
    }
    let hash = createHmac('sha256', decodedSecret)
            .update(`${header}.${payload}`)
            .digest('hex');
    return URLSafeBase64.encode(Buffer.from(hash, 'hex'));
  }

  stripSpacing(text: string): string {
    return text.replace(/\s/g, '' );
  }

  toggleBase64Encoded(newState: boolean) {
    this.base64encoded = newState;
  }

}
