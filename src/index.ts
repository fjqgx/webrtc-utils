import { DecoderManager } from "./codec/decoder-manager";
import { EncoderManager } from "./codec/encoder-manager";
import { SdpUtil } from "./sdp/sdp-util";
import { WhepPlayer } from "./webrtc/whep";


declare global {
  interface Window {
    DecoderManager: any;
    EncoderManager: any;
    SdpUtil: any;
    WhepPlayer: any;
    mozRTCPeerConnection: any;
    webkitRTCPeerConnection: any;
  }
}

if (window) {
  window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  window.DecoderManager = DecoderManager;
  window.EncoderManager = EncoderManager;
  window.SdpUtil = SdpUtil;
  window.WhepPlayer = WhepPlayer;
}

export { DecoderManager, EncoderManager, SdpUtil, WhepPlayer };

