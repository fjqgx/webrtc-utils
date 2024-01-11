import { WhepPlayerConfig, WhepPlayerErrorCode } from "../../../types/index";


export class WhepPlayer {

  protected pc?: RTCPeerConnection;

  protected timerId: number = 0;

  constructor () {

  }

  public play (url: string, config?: WhepPlayerConfig): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
      this.stop();
      this.pc = new RTCPeerConnection();
      this.pc.addTransceiver('audio', {direction: 'recvonly'});
      this.pc.addTransceiver('video', {direction: 'recvonly'});
      this.pc?.addEventListener("track", (event: RTCTrackEvent) => {
        this.startTimeoutTimer();
        resolve(event.streams[0]);
      })
      this.timerId = window.setTimeout(() => {
        reject({
          code: -1,
          message: "timeout"
        })
      }, 5000);
      this.pc?.createOffer().then((offer: RTCSessionDescriptionInit) => {
        this.pc?.setLocalDescription(offer).then(() => {
          this.reqeustEndPoint(url, offer, config?.headers).then((response: string) => {
            let answer: RTCSessionDescriptionInit = {
              type: "answer",
              sdp: response
            }
            this.pc?.setRemoteDescription(answer).then(() => {
              // emit event
            }).catch((err: Error) => {
              this.stop();
              reject({
                code: WhepPlayerErrorCode.WebRTCError,
                message: err.message
              })
            })
          }).catch((err) => {
            this.stop();
            reject(err);
          })
        }).catch((err)=> {
          this.stop();
          reject({
            code: WhepPlayerErrorCode.WebRTCError,
            message: err.message
          })
        })
      }).catch((err) => {
        this.stop();
        reject({
          code: WhepPlayerErrorCode.WebRTCError,
          message: err.message
        })
      })
    })
  }

  public stop (): void {
    this.pc?.close();
    this.pc = undefined;

    this.startTimeoutTimer();
  }

  protected reqeustEndPoint (url: string, offer: RTCSessionDescriptionInit, headers?: any): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!headers) {
        headers = {};
      }
      headers["content-type"] = "application/json";
      let init: RequestInit = {
          method: "POST",
          headers,
          body: offer.sdp
        };
        fetch(url, init).then((res: any) => {
          res.text().then((data: string) => {
            resolve(data);
          }).catch((err: Error) => {
            reject(err);
          })
        }).catch((err: Error) => {
          reject(err);
        })
    })
  }

  protected startTimeoutTimer (): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    this.timerId = 0;
  }
}