import { SdpUtil } from "../../src/sdp/sdp-util";
import { Direction, MlineInfo, VideoDecoderInfo, VideoEncoderInfo } from "../../types/index";
import { Unified_Plan_Windows_Sdp } from "../__mocks__/sdp-data";


describe('test index.ts', () => {
  let util: SdpUtil = new SdpUtil();

  test ("test—unified-plan-sendrecv", () => {
    util.init(Unified_Plan_Windows_Sdp.Chrome_118_SendRecv_Video);
    const mlineArr: MlineInfo[] = util.getMlineInfo();
    expect(mlineArr.length).toBe(1);
    const info: MlineInfo = mlineArr[0]; 
    expect(info.mid).toBe(0);
    expect(info.directron).toBe(Direction.SendRecv);
  })

  test ("test-unified-plan-recvonly", () => {
    util.init(Unified_Plan_Windows_Sdp.Chrome_118_SendOnly_Video);
    const mlineArr: MlineInfo[] = util.getMlineInfo();
    expect(mlineArr.length).toBe(1);
    const info: MlineInfo = mlineArr[0]; 
    expect(info.mid).toBe(0);
    expect(info.directron).toBe(Direction.SendOnly);

  })

  test ("test_unified-plan-sendonly", () => {
    util.init(Unified_Plan_Windows_Sdp.Chrome_118_RecvOnly_Video);
    const mlineArr: MlineInfo[] = util.getMlineInfo();
    expect(mlineArr.length).toBe(1);
    const info: MlineInfo = mlineArr[0]; 
    expect(info.mid).toBe(0);
    expect(info.directron).toBe(Direction.RecvOnly);
  })
})