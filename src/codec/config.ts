export enum CodecName {
  H264,
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

export type HardwareAcceleration = "no-preference" | "prefer-hardware" | "prefer-software";