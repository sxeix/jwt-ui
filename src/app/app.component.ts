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
  resultToken: string = 'none'

  ngOnInit() {
    this.optionContentMap.set('first', '{"test1":"result1"}');
    this.optionContentMap.set('second', '{"test2":"result2"}');
    this.optionContentMap.set('third', '{"test3":"result3"}');
  }

  getContent(): string | undefined {
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
    let hash = createHmac('sha256', this.stripSpacing(this.secret))
            .update(`${header}.${payload}`)
            .digest('hex');
    return URLSafeBase64.encode(Buffer.from(hash, 'hex'));
  }

  stripSpacing(text: string): string {
    return text.replace(/\s/g, '' );
  }

}
