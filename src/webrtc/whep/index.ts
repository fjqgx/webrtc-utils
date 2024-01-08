import { MlineInfo, SdpUtil, VideoCodec } from "../../../types/index";

declare global {
  interface Window {
    mozRTCPeerConnection: any;
    webkitRTCPeerConnection: any;
  }
}

if (window) {
  window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
}


export const enum MediaType {
  Audio = 1,
  Video,
  Both,
}

export const enum WhepPlayerErrorCode {
  NotSupportWebRTC = 1001,
  WebRTCError = 1002,
  CodecError = 1003,
}

export interface WhepPlayerConfig {
  mediaType: MediaType;
  videoCodecs?: VideoCodec[];
}

export interface WhepResponse {
  code: number;
  message: string;
  answer: {
    type: 'answer',
    sdp: string,
  }
}

export class WhepPlayer {

  protected pc?: RTCPeerConnection;

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


  public play (url: string, config?: WhepPlayerConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      this.stop();
      this.initPeerConnection(config);
      this.pc?.createOffer().then((offer: RTCSessionDescriptionInit) => {
        this.pc?.setLocalDescription(offer).then(() => {
          this.reqeustEndPoint(url, offer).then((response: WhepResponse) => {
            if (200 === response.code) {
              this.pc?.setRemoteDescription(response.answer).then(() => {
                
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
  }

  protected reqeustEndPoint (url: string, offer: RTCSessionDescriptionInit): Promise<WhepResponse> {
    return new Promise((resolve, reject) => {
      let init: RequestInit = {
        method: "POST",
        headers: [["content", "application/sdp"]],
        body: JSON.stringify(offer)
      };
      fetch(url, init).then((res: any) => {
        console.log("suc:", res);
      }).catch((err) => {
        console.log("err:", err);
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
}