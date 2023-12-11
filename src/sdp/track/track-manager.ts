
export abstract class TrackManager {

  protected mid: number = -1;

  protected lineArr: string[] = [];

  constructor () {}

  abstract appendInfo (infoStr: string): boolean;

  public getSdpLines(): string {
    return this.lineArr.join('\r\n');
  }

  protected parseSdpLines(infoStr: string): void {
    this.lineArr = infoStr.split('\r\n');
  }

}