import { DecoderManager } from "./codec/decoder-manager";
import { EncoderManager } from "./codec/encoder-manager";


declare global {
  interface Window {
    DecoderManager: DecoderManager;
    EncoderManager: EncoderManager;
  }
}

if (window) {
  window.DecoderManager = DecoderManager;
  window.EncoderManager = EncoderManager;
}

export { DecoderManager, EncoderManager };

