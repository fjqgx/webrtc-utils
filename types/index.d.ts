
export declare class DecoderManager {
  /**
   * 判断当前环境是否支持检测
   */
  static isSupport(): boolean;

  static isSupported(info: CodecInfo): Promise<SupportResult>;
}

export declare class EncoderManager {
  /**
   * 判断当前环境是否支持检测
   */
  static isSupport(): boolean;

  static isSupported(info: CodecInfo): Promise<SupportResult>;
}


export const enum CodecName {
  H264 = 0,
  VP8,
  VP9,
  AV1,
}

export interface CodecInfo {
  /**
   * 解码器名称
   */
  codec: CodecName;

  /**
   * H264需要传入此字段
   */
  profile_level?: string;

  /**
   * 是否只检测硬件解码能力
   */
  hardware?: boolean;

  /**
   * 视频宽度
   */
  frameWidth?: number;

  /**
   * 视频高度
   */
  frameHeight?: number;
}

export interface SupportResult {
  info: CodecInfo;
  supported: boolean;
}


/**
 * 解码器能力检测错误码
 */
export enum CodecErrorCode {
  /**
   * 当前环境不支持判断，目前需要Chrome 94版本以上才能支持判断
   */
  NotSupport = 10000,

  /**
   * 参数错误，一般会在message中给出错误原因
   */
  WrongParam = 10001,

  /**
   * 检测失败
   */
  CheckError = 10002,
}



export declare class SdpUtil {

  readonly sdp: string;

  init (sdp: string): void;

  getMlineInfo(): MlineInfo[];
}

export interface HeaderExtension {
  id: number;
  uri: string;
}

export const enum Direction {
  SendOnly = 'sendonly',
  RecvOnly = 'recvonly',
  SendRecv = 'sendrecv',
  Unknown = 'unknown',
}

export interface MlineInfo {
  readonly directron: Direction;
  readonly mid: number;
  readonly headerExtensions: HeaderExtension[];
  readonly codecs: VideoCodecInfo[];
}

export interface VideoEncoderInfo {
  headerExtension: HeaderExtension[];
  codecs: VideoCodecInfo[];
}

export interface VideoDecoderInfo {
  headerExtension: HeaderExtension[];
  codecs: VideoCodecInfo[];
}

export interface AudioCodecInfo {

}

export interface VideoCodecInfo {
  clockRate: number;
  codec: VideoCodec;
  payloadType: number;
  profile_level_id: string; 
}

export const enum VideoCodec {
  H264 = 'H264',
  H265 = 'H265',
  VP8 = 'VP8',
  VP9 = 'VP9',
  AV1 = 'AV1',

}