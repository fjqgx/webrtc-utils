import { SdpManager } from "../../src/sdp/sdp-manager";
import { windows_chrome_112_offer } from "../sdp-data/unified-plan/offer";


describe('test sdp-manager', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  })

  test("test offer", () => {
    let manager: SdpManager = new SdpManager();
    manager.parseSdp(windows_chrome_112_offer);
  })
})