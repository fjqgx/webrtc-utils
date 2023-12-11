import { Direction, MlineInfo, VideoCodec, VideoCodecInfo } from "../../../types/index";
import { MLine, MLineType, SDP_LINE_HEAD } from "./mline";

export class Video extends MLine {

  constructor (type: MLineType, mLineStr: string) {
    super(type, mLineStr);

    this.parseVideoInfo(mLineStr.split('\r\n'));
  }

  /**
    * 解析视频通道信息
    * @param arr 
    */
  protected parseVideoInfo (arr: string[]): void {
    let payloadTypeArr: string[] = this.parsePayloadTypeArr(arr[0]);
    for (let i = 1; i < arr.length; ++i) {
      let s: RegExpMatchArray | null = arr[i].match(/a=(.*):(\d*) /);
      if (s && s.length > 1 && s.input) {
        switch(s[1]) {
          case SDP_LINE_HEAD.Head:
            this.parseHeaderExtensions(arr[i]);
            break;

          case SDP_LINE_HEAD.Codec:
            let codecInfo: VideoCodecInfo | null = this.parseVideoCodecInfo(s, payloadTypeArr);
            if (codecInfo) {
              this.codecArr.push(codecInfo);
            }
            break;

          case SDP_LINE_HEAD.Fmtp:
            this.updateFmtpInfo(arr[i]);
            break;

          default:
            // console.log("line1:", s);
            break;
        }
      } else {
        let s2: RegExpMatchArray | null = arr[i].match(/a=(.*)/);
        if (s2 && s2.length > 1) {
          if (Direction.SendRecv === s2[1] || Direction.RecvOnly === s2[1] || Direction.SendOnly === s2[1]) {
            this.mLineDirection = s2[1];
          } else {
            let arr2: string[] = arr[i].split(':');
            if (arr2.length === 2 && arr2[0] === 'a=' + SDP_LINE_HEAD.Mid) {
              this.mLineMid = parseInt(arr2[1], 10);
            }
          }
        }
      } 
    }
  }

  private parseVideoCodecInfo (s: RegExpMatchArray, payloadTypeArr: string[]): VideoCodecInfo | null {
    let info: VideoCodecInfo | null = null;
    if (s.length > 2 && s.input) {
      let payloadType: string = s[2];
      let index: number = payloadTypeArr.indexOf(payloadType);
      if (index > -1) {
        payloadTypeArr.splice(index, 1);
        let s1: RegExpMatchArray | null = s.input.match(/a=rtpmap:(\d*) (.*)\/9000/);
        if (s1 && s1.length > 2) {
          let codec: VideoCodec | null = null;
          switch (s1[2]) {
            case VideoCodec.H264:
              codec = VideoCodec.H264;
              break;

            case VideoCodec.VP8:
              codec = VideoCodec.VP8;
              break;

            case VideoCodec.VP9:
              codec = VideoCodec.VP9;
              break;
            
            case VideoCodec.H265:
              codec = VideoCodec.H265;
              break;

            case VideoCodec.AV1:
              codec = VideoCodec.AV1;
              break;

            default:
              break;
          }
          if (codec !== null) {
            info = {
              clockRate: 9000,
              codec,
              payloadType: parseInt(payloadType, 10),
              profile_level_id: '',
            }
          }
          
        }
      }
    }
    return info;
  }

  private updateFmtpInfo (line: string): void {
    let s1: RegExpMatchArray | null = line.match(/a=fmtp:(\d*) (.*)profile-level-id=(.*)/);
      if (s1 && s1.length > 3) {
        const payloadType: number = parseInt(s1[1]);
        const profile_level_id: string = s1[3];
        for (let i = 0; i < this.codecArr.length; ++i) {
          if (payloadType === this.codecArr[i].payloadType) {
            this.codecArr[i].profile_level_id = profile_level_id;
            // console.log("profile:", this.codecArr[i]);
            break;
          }
        }
      }
  }
}