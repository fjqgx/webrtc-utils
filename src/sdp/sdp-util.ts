import { MlineInfo } from "../../types/index";
import { MLine, MLineType } from "./mline/mline";
import { Video } from "./mline/video";


export class SdpUtil {

  protected sdpArr: string[];

  protected mlineArr: MLine[];


  constructor () {
    this.sdpArr = [];
    this.mlineArr = [];
  }

  public init (sdpStr: string): void {
    this.sdpArr = sdpStr.split('\r\n');
    this.parseSdp(sdpStr);
  }

  get sdp (): string {
    return this.sdpArr.join('\r\n');
  }

  public getMlineInfo(): MlineInfo[] {
    return this.mlineArr;
  }

  protected parseSdp (sdp: string): void {
    this.mlineArr.splice(0);
    let arr: string[] = sdp.split('m=');
    if (arr.length > 1) {
      for (let i = 1; i < arr.length; ++i) {
        if (0 === arr[i].indexOf(MLineType.Audio)) {
          // this.mlineArr.push(new MLine(MLineType.Audio, arr[i]));
        } else if (0 === arr[i].indexOf(MLineType.Video)) {
          this.mlineArr.push(new Video(MLineType.Video, arr[i]));
        } else if (0 === arr[i].indexOf(MLineType.DataChannel)) {
          // this.mlineArr.push(new MLine(MLineType.DataChannel, arr[i]));
        }
      }
    }
  }
}