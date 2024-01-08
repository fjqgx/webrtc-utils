import { SdpUtil } from "../../src/sdp/sdp-util";
import { Direction, MlineInfo, VideoDecoderInfo, VideoEncoderInfo } from "../../types/index";
import { Plan_B_Android_Sdp, Unified_Plan_Windows_Sdp } from "../__mocks__/sdp-data";


// describe('test unified-plan', () => {
//   let util: SdpUtil = new SdpUtil();

//   test ("test—unified-plan-sendrecv", () => {
//     util.init(Unified_Plan_Windows_Sdp.Chrome_118_SendRecv_Video);
//     const mlineArr: MlineInfo[] = util.getMlineInfo();
//     expect(mlineArr.length).toBe(1);
//     const info: MlineInfo = mlineArr[0]; 
//     expect(info.mid).toBe(0);
//     expect(info.directron).toBe(Direction.SendRecv);
//     expect(util.sdp).toBe(Unified_Plan_Windows_Sdp.Chrome_118_SendRecv_Video);
//   })

//   test ("test-unified-plan-recvonly", () => {
//     util.init(Unified_Plan_Windows_Sdp.Chrome_118_SendOnly_Video);
//     const mlineArr: MlineInfo[] = util.getMlineInfo();
//     expect(mlineArr.length).toBe(1);
//     const info: MlineInfo = mlineArr[0]; 
//     expect(info.mid).toBe(0);
//     expect(info.directron).toBe(Direction.SendOnly);
//     expect(util.sdp).toBe(Unified_Plan_Windows_Sdp.Chrome_118_SendOnly_Video);
//   })

//   test ("test_unified-plan-sendonly", () => {
//     util.init(Unified_Plan_Windows_Sdp.Chrome_118_RecvOnly_Video);
//     const mlineArr: MlineInfo[] = util.getMlineInfo();
//     expect(mlineArr.length).toBe(1);
//     const info: MlineInfo = mlineArr[0]; 
//     expect(info.mid).toBe(0);
//     expect(info.directron).toBe(Direction.RecvOnly);
//     expect(util.sdp).toBe(Unified_Plan_Windows_Sdp.Chrome_118_RecvOnly_Video);
//   })
// })

describe('test plan-b', () => {
  let util: SdpUtil = new SdpUtil();

  test ("test android chrome 73 plan-b", () => {
    util.init(Plan_B_Android_Sdp.Chrome_73_SendRecv_Video);
    const mlineArr: MlineInfo[] = util.getMlineInfo();
    console.log("arr:", mlineArr);
    // expect(mlineArr.length).toBe(1);
    // const info: MlineInfo = mlineArr[0]; 
    // expect(info.mid).toBe(0);
    // expect(info.directron).toBe(Direction.SendRecv);
    // expect(util.sdp).toBe(Unified_Plan_Windows_Sdp.Chrome_118_SendRecv_Video);
  })
})