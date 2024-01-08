import { MlineInfo } from "../../types/index";
import { MLine, MLineType } from "./mline/mline";
import { Video } from "./mline/video";


export class SdpUtil {

  protected headArr: string[];

  protected mlineArr: MLine[];


  constructor () {
    this.headArr = [];
    this.mlineArr = [];
  }

  public init (sdpStr: string): void {
    this.mlineArr.splice(0);
    let arr: string[] = sdpStr.split('m=');
    console.log(arr.length);
    this.headArr = arr[0].split('\r\n');
    if (arr.length > 1) {
      for (let i = 1; i < arr.length; ++i) {
        if (0 === arr[i].indexOf(MLineType.Audio)) {
          // this.mlineArr.push(new MLine(MLineType.Audio, arr[i]));
        } else if (0 === arr[i].indexOf(MLineType.Video)) {
          this.mlineArr.push(new Video(MLineType.Video, 'm=' + arr[i]));
        } else if (0 === arr[i].indexOf(MLineType.DataChannel)) {
          // this.mlineArr.push(new MLine(MLineType.DataChannel, arr[i]));
        }
      }
    }
  }

  get sdp (): string {
    let sdpStr: string = this.headArr.join('\r\n');
    for (let i = 0; i < this.mlineArr.length; ++i) {
      sdpStr += this.mlineArr[i].sdpStr;
    }
    return sdpStr;
  }

  public getMlineInfo(): MlineInfo[] {
    return this.mlineArr;
  }

 
}