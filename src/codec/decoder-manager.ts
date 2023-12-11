import { CodecName, CodecErrorCode, CodecInfo, SupportResult, HardwareAcceleration } from "./config";

/** Available only in secure contexts. */
declare class VideoDecoder {
  readonly decodeQueueSize: number;
  // readonly state: CodecState;
  public static isConfigSupported(config:VideoDecoderConfig): Promise<VideoDecoderSupport>;
  close(): void;
  configure(config: VideoDecoderConfig): void;
  // decode(chunk: EncodedVideoChunk): void;
  flush(): Promise<void>;
  reset(): void;
}

interface VideoDecoderConfig {
  codec: string;
  codedHeight?: number;
  codedWidth?: number;
  // colorSpace?: VideoColorSpaceInit;
  // description?: BufferSource;
  // displayAspectHeight?: number;
  // displayAspectWidth?: number;
  hardwareAcceleration?: HardwareAcceleration;
  // optimizeForLatency?: boolean;
}

interface VideoDecoderSupport {
  config?: VideoDecoderConfig;
  supported?: boolean;
}

/**
 * 用于检测当前浏览器的解码器支持情况
 */
export class DecoderManager {

  constructor () {
    
  }

  public static isSupport(): boolean {
    return VideoDecoder && VideoDecoder.isConfigSupported !== undefined;
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
            const config: VideoDecoderConfig = {
              codec: codec,
            }
            if (info.hardware !== undefined) {
              config.hardwareAcceleration = info.hardware ? 'prefer-hardware' : 'prefer-software';
            }
            if (info.frameWidth !== undefined) {
              config.codedWidth = info.frameWidth;
            }
            if (info.frameHeight !== undefined) {
              config.codedHeight = info.frameHeight;
            }
            VideoDecoder.isConfigSupported(config).then((support:VideoDecoderSupport) => {
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