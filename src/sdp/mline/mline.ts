import { AudioCodecInfo, Direction, HeaderExtension, MlineInfo, VideoCodecInfo, VideoDecoderInfo, VideoEncoderInfo } from "../../../types/index";


export const enum SDP_LINE_HEAD {
  Mid = 'mid',
  Head = 'extmap',
  Codec = 'rtpmap',
  Fmtp = 'fmtp',
}


export const enum MLineType {
  Audio = 'audio',
  Video = 'video',
  DataChannel = 'applaction',
  None = 'none',
}


export abstract class MLine implements MlineInfo {

  protected type: MLineType;

  protected mLineDirection: Direction;

  protected mLineMid: number = -1;

  protected codecArr: VideoCodecInfo[] = [];

  protected headerExtensionArr: HeaderExtension[] = [];

  constructor (type: MLineType, mLineStr: string) {
    this.type = type;
    this.mLineDirection = Direction.Unknown;
  }

  get directron (): Direction {
    return this.mLineDirection;
  }

  get mid (): number {
    return this.mLineMid;
  }

  get codecs(): VideoCodecInfo[] {
    return this.codecArr;
  }

  get headerExtensions(): HeaderExtension[] {
    return this.headerExtensionArr;
  }

  abstract removeCodec(codec: VideoCodecInfo | AudioCodecInfo): boolean;

  /**
   * uinfied-plan格式根据mline的第一行解析当前mline的payloadType
   * @param line 
   * @returns 
   */
  protected parsePayloadTypeArr (line: string): string[] {
    let arr: string[] = line.split(' ');
    if (arr.length > 3) {
      return arr.slice(3);
    }
    return [];
  }

  protected parseHeaderExtensions(line: string): void {
    let s: RegExpMatchArray | null = line.match(/a=extmap:(\d*) (.*)/);
    if (s && s.length > 2) {
      this.headerExtensionArr.push({
        id: parseInt(s[1]),
        uri: s[2],
      })
    }
  }
}