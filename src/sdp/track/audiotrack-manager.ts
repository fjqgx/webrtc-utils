import { TrackManager } from "./track-manager"


export class AudioTrackManager extends TrackManager {

  constructor () {
    super();
  }

  public appendInfo(infoStr: string): boolean {
    this.parseSdpLines(infoStr);
    for (let i = 0; i < this.lineArr.length; ++i) {
      console.log(this.lineArr[i]);
    }
    return true;
  }
}