import { DecoderManager } from "./codec/decoder-manager";
import { EncoderManager } from "./codec/encoder-manager";
import { SdpUtil } from "./sdp/sdp-util";


declare global {
  interface Window {
    DecoderManager: DecoderManager;
    EncoderManager: EncoderManager;
    SdpUtil: SdpUtil;
  }
}

if (window) {
  window.DecoderManager = DecoderManager;
  window.EncoderManager = EncoderManager;
  // @ts-ignore
  window.SdpUtil = SdpUtil;
}

export { DecoderManager, EncoderManager, SdpUtil };

