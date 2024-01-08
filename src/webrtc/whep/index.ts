import { MediaType, MlineInfo, SdpUtil, VideoCodec, WhepPlayerConfig, WhepPlayerErrorCode, WhepResponse } from "../../../types/index";


export class WhepPlayer {

  protected pc?: RTCPeerConnection;

  protected timerId: number = 0;

  constructor () {

  }

  static isSupport (config: WhepPlayerConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.RTCPeerConnection) {
        let pc: RTCPeerConnection | null = new RTCPeerConnection();
        if (pc.addTransceiver !== undefined) {
          if (MediaType.Audio === config.mediaType) {
            pc.close();
            pc = null;
            resolve();
          } else {
            if (config.videoCodecs && config.videoCodecs.length > 0) {
              const supportCodecArr: VideoCodec[] = config.videoCodecs;
              pc.addTransceiver('video', {direction: 'recvonly'});
              pc.createOffer().then((offer: RTCSessionDescriptionInit) => {
                let util: SdpUtil = new SdpUtil();
                util.init(offer.sdp as string);
                let info: MlineInfo = util.getMlineInfo()[0];
                let bFind: boolean = false;
                for (let i = 0; i < info.codecs.length; ++i) {
                  const codec: VideoCodec = info.codecs[i].codec;
                  if (supportCodecArr.indexOf(codec) > -1) {
                    bFind = true;
                    break;
                  }
                }
                if (bFind) {
                  pc?.close();
                  pc = null;
                  resolve();
                } else {
                  pc?.close();
                  pc = null;
                  reject({
                    code: WhepPlayerErrorCode.CodecError,
                    message: 'video codec mismatch'
                  })
                }
              }).catch((err: Error) => {
                pc?.close();
                pc = null;
                reject({
                  code: WhepPlayerErrorCode.WebRTCError,
                  message: err.message
                })
              })  
            } else {
              pc?.close();
              pc = null;
              resolve();
            }
          }
        } else {
          pc?.close();
          pc = null;
          reject({
            code: WhepPlayerErrorCode.WebRTCError,
            message: "not support addTransceiver"
          })
        }
      } else {
        reject({
          code: WhepPlayerErrorCode.NotSupportWebRTC,
          message: "not suppport webrtc"
        })
      }
    })
  }


  public play (url: string, config?: WhepPlayerConfig): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
      this.stop();
      this.initPeerConnection(config);
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
          this.reqeustEndPoint(url, offer).then((response: WhepResponse) => {
            if (200 === response.code) {
              this.pc?.setRemoteDescription(response.answer).then(() => {
                // emit event
              }).catch((err: Error) => {
                this.stop();
                reject({
                  code: WhepPlayerErrorCode.WebRTCError,
                  message: err.message
                })
              })
            } else {
              this.stop();
              reject({
                code: response.code,
                message: response.message
              })
            }
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

  protected reqeustEndPoint (url: string, offer: RTCSessionDescriptionInit, headers?: any): Promise<WhepResponse> {
    return new Promise((resolve, reject) => {
      if (!headers) {
        headers = {};
      }
      headers["content"] = "application/sdp";
      let init: RequestInit = {
        method: "POST",
        headers,
        body: JSON.stringify(offer)
      };
      fetch(url, init).then((res: any) => {
        res.json().then((data: WhepResponse) => {
          resolve(data);
        }).catch((err: Error) => {
          reject(err);
        })
      }).catch((err: Error) => {
        reject(err);
      })
    })
  }

  protected initPeerConnection(config?: WhepPlayerConfig): void {
    this.pc = new RTCPeerConnection();
    let mediaType: MediaType = MediaType.Both;
    if (config) {
      if (config.mediaType === MediaType.Audio) {
        mediaType = MediaType.Audio;
      } else if (config.mediaType === MediaType.Video) {
        mediaType = MediaType.Video;
      }
    }
    if (MediaType.Audio === mediaType) {
      this.pc.addTransceiver('audio', {direction: 'recvonly'});
    } else if (MediaType.Video === mediaType) {
      this.pc.addTransceiver('video', {direction: 'recvonly'});
    } else {
      this.pc.addTransceiver('audio', {direction: 'recvonly'});
      this.pc.addTransceiver('video', {direction: 'recvonly'});
    }
  }

  protected startTimeoutTimer (): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    this.timerId = 0;
  }
}