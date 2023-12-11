import { DecoderManager } from "./codec/decoder-manager";
import { EncoderManager } from "./codec/encoder-manager";
import { SdpUtil } from "./sdp/sdp-util";


declare global {
  interface Window {
    DecoderManager: any;
    EncoderManager: any;
    SdpUtil: any;
  }
}

if (window) {
  window.DecoderManager = DecoderManager;
  window.EncoderManager = EncoderManager;
  window.SdpUtil = SdpUtil;
}

export { DecoderManager, EncoderManager, SdpUtil };

