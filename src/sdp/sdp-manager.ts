import { MLineType } from "./config";
import { AudioTrackManager } from "./track/audiotrack-manager";
import { Head } from "./track/head";
import { TrackManager } from "./track/track-manager";
import { VideoTrackManager } from "./track/videotrack-manager";

/**
 * sdp管理类
 */
export class SdpManager {

  protected managerArr: TrackManager[] = [];

  constructor () {

  }

  /**
   * 解析SDP
   * @returns 
   */
  public parseSdp (sdp: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let arr: string[] = sdp.split('m=');
      this.managerArr.splice(0);
      let head: Head = new Head();
      head.appendInfo(arr[0]);
      this.managerArr.push(head);
      if (arr.length > 1) {
        for (let i = 1; i < arr.length; ++i) {
          if (0 === arr[i].indexOf(MLineType.Audio)) {
            let audio: AudioTrackManager = new AudioTrackManager();
            audio.appendInfo(arr[i]);
            this.managerArr.push(audio);
          } else if (0 === arr[i].indexOf(MLineType.Video)) {
            let video: VideoTrackManager = new VideoTrackManager();
            video.appendInfo(arr[i]);
            this.managerArr.push(video);
          } else if (0 === arr[i].indexOf(MLineType.DataChannel)) {
          //   this.datachannelManager.appendInfo(arr[i]);
          }
        }
      }
    })
    
  }
}


// protected sdpArr: string[] = [];

  // protected audioTrackManager: AudioTrackManager = new AudioTrackManager();
  // protected videoTrackManager: VideoTrackManager = new VideoTrackManager();
  // protected datachannelManager: DataChannelManager = new DataChannelManager();

 

  // get sdp (): string {
  //   // return this.sdpArr.join('\r\n');
  //   return '';
  // }

 

  // /**
  //  * 设置Offer信息
  //  * @param offer 
  //  * @returns 
  //  */
  // setOffer(offer:RTCSessionDescription): Promise<OfferContent> {
  //   return new Promise((resolve, reject) => {
  //     if (offer && SdpType.Offer === offer.type && offer.sdp) {
  //       let content: OfferContent = {
  //         type: SdpType.Offer
  //       };
  //       let arr: string[] = offer.sdp.split('m=');
  //       if (arr.length > 1) {
  //         for (let i = 1; i < arr.length; ++i) {
  //           if (0 === arr[i].indexOf(MLineType.Audio)) {
  //             this.audioTrackManager.appendInfo(arr[i]);
  //           } else if (0 === arr[i].indexOf(MLineType.Video)) {
  //             this.videoTrackManager.appendInfo(arr[i]);
  //           } else if (0 === arr[i].indexOf(MLineType.DataChannel)) {
  //             this.datachannelManager.appendInfo(arr[i]);
  //           }
  //         }
  //       }
  //       resolve(content);
  //     } else {
  //       reject({
  //         code: -1,
  //         message: ''
  //       })
  //     }
  //   })
    
  // }