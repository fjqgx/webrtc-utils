import { TrackManager } from "./track-manager";


export class Head extends TrackManager {

  constructor () {
    super();
  }

  public appendInfo (infoStr: string): boolean {
    this.parseSdpLines(infoStr);
    if (this.lineArr.length > 0 && 0 == this.lineArr[0].indexOf('v=')) {
      return true;
    }

    return false;
  }
}