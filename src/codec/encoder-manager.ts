import { CodecName, CodecErrorCode, CodecInfo, SupportResult, HardwareAcceleration } from "./config";

/** Available only in secure contexts. */
declare class VideoEncoder {
  readonly encodeQueueSize: number;
  // readonly state: CodecState;
  public static isConfigSupported(config:VideoEncoderConfig): Promise<VideoEncoderSupport>;
  close(): void;
  configure(config: VideoEncoderConfig): void;
  // encode(frame: VideoFrame, options?: VideoEncoderEncodeOptions): void;
  flush(): Promise<void>;
  reset(): void;
}

interface VideoEncoderConfig {
  // alpha?: AlphaOption;
  // avc?: AvcEncoderConfig;
  // bitrate?: number;
  // bitrateMode?: VideoEncoderBitrateMode;
  codec: string;
  // displayHeight?: number;
  // displayWidth?: number;
  // framerate?: number;
  hardwareAcceleration?: HardwareAcceleration;
  height: number;
  // latencyMode?: LatencyMode;
  // scalabilityMode?: string;
  width: number;
}

interface VideoEncoderSupport {
  config?: VideoEncoderConfig;
  supported?: boolean;
}

/**
 * 用于检测当前浏览器的编码器支持情况
 */
export class EncoderManager {

  constructor () {
    
  }

  public static isSupport(): boolean {
    return VideoEncoder && VideoEncoder.isConfigSupported !== undefined;
  }

  /**
   * 检测是否支持当前的解码器
   * @returns 
   */
  public static isSupported(info: CodecInfo): Promise<SupportResult> {
    return new Promise((resolve, reject) => {
      if (this.isSupport()) {
        if (info) {
          if (info.codec == CodecName.H264 || info.codec == CodecName.VP8 || info.codec == CodecName.VP9 || info.codec == CodecName.AV1) {
            let codec: string = '';
            switch(info.codec) {
              case CodecName.H264:
                codec = `avc1.${info.profile_level}`;
                break;

              case CodecName.VP8:
                codec = `vp8`;
                break;

              case CodecName.VP9:
                codec = `vp9`;
                break;

              case CodecName.AV1:
                codec = `av01.0.04M.08`;
                break;
            }
            const config: VideoEncoderConfig = {
              codec: codec,
              width: info.frameWidth ? info.frameWidth : 1920,
              height: info.frameHeight ? info.frameHeight : 1080,
    //           alpha?: AlphaOption | undefined;
    // avc?: AvcEncoderConfig | undefined;
    // bitrate?: number | undefined;
    // bitrateMode?: VideoEncoderBitrateMode | undefined;
   
    // displayHeight?: number | undefined;
    // displayWidth?: number | undefined;
    // framerate?: number | undefined;
    // hardwareAcceleration?: HardwarePreference | undefined;
  
    // latencyMode?: LatencyMode | undefined;
    // scalabilityMode?: string | undefined;
            }
            if (info.hardware !== undefined) {
              config.hardwareAcceleration = info.hardware ? 'prefer-hardware' : 'prefer-software';
            }
            VideoEncoder.isConfigSupported(config).then((support: VideoEncoderSupport) => {
              resolve({
                info: info,
                supported: support.supported == true
              })
            }).catch((err) => {
              reject({
                code: err.code,
                message: err.message 
              })
            })
          } else {
            reject({
              code: CodecErrorCode.WrongParam,
              message: 'codec is wrong'
            })
          }
        } else {
          reject({
            code: CodecErrorCode.WrongParam,
            message: 'info is null'
          })
        }

        
        
      } else {
        reject({
          code: CodecErrorCode.NotSupport,
          message: 'not support'
        })
      }
    })
  }
}