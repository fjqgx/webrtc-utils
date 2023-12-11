import { SDP_LINE_HEAD, TRACK_DIRECTION } from "./sdpline-config";
import { TrackManager } from "./track-manager";

/**
 * 视频通道
 */
export class VideoTrackManager extends TrackManager {

  protected track_direction: TRACK_DIRECTION = TRACK_DIRECTION.Unknown;

  constructor () {
    super();
  }

  /**
   * 添加通道信息
   * @param infoStr 
   */
  public appendInfo(infoStr: string): boolean {
    this.parseSdpLines(infoStr);
    this.lineArr[0] = 'm=' + this.lineArr[0];
    this.parseVideoInfo();
    return true;
  }

  /**
   * 解析视频通道信息
   */
  protected parseVideoInfo (): void {
    for (let i = 0; i < this.lineArr.length; ++i) {
      let s: RegExpMatchArray | null = this.lineArr[i].match(/a=(.*):(\d*) /);
      if (s && s.length > 1) {
        // console.log(s);
        switch(s[1]) {
          case SDP_LINE_HEAD.Head:
            console.log("head:", this.lineArr[i]);
            break;

          default:
            break;
        }
      } else {
        let s2: RegExpMatchArray | null = this.lineArr[i].match(/a=(.*)/);
        if (s2 && s2.length > 1) {
          if (TRACK_DIRECTION.SendRecv === s2[1] || TRACK_DIRECTION.RecvOnly === s2[1] || TRACK_DIRECTION.SendOnly === s2[1]) {
            this.track_direction = s2[1];
          } else {
            let arr2: string[] = this.lineArr[i].split(':');
            if (arr2.length === 2 && arr2[0] === SDP_LINE_HEAD.Mid) {
              this.mid = parseInt(arr2[1], 10);
            } else {
              // console.log("bbb:", arr[i], s2);
            }
            
          }
        } else {
          // console.log("ccc:", arr[i], s2?.length)
        } 
      } 
    }
  }
}