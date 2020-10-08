export class ProductPlan {
  static getProductConfig(plan: number) {
    //TODO: Please change the rest of the scan counts as you wish
    if (plan === 0) {
      return {
        planId: "plan_HKRp6LuMuyfGsQ",
        price: 9.99,
        name: "Light Plan",
        scanCount: 10,
        isOneTime: false,
      };
    } else if (plan === 1) {
      return {
        planId: "plan_HK0sHtauqxmO6d",
        price: 49.0,
        scanCount: 10,
        name: "Business Plan",
        isOneTime: false,
      };
    } else if (plan === 2) {
      return {
        planId: "plan_HKRsIElhfvFafk",
        price: 450.0,
        scanCount: 10,
        name: "Yearly Plan",
        isOneTime: false,
      };
    } else if (plan === 3) {
      return {
        planId: "price_1HZbINFZus0fdoRP10bUV1nC",
        price: 299.0,
        scanCount: 10,
        name: "On-Page SEO Service + 10 extra scans",
        isOneTime: true,
      };
    } else if (plan === 4) {
      return {
        planId: "plan_HKiDtU7794m0RR",
        price: 24.9,
        scanCount: 10,
        name: "Light Idea",
        isOneTime: false,
      };
    } else if (plan === 5) {
      return {
        planId: "plan_HKiCQJ5Mn73MBw",
        price: 99.9,
        scanCount: 50,
        name: "Yearly Plan",
        isOneTime: false,
      };
    } else if (plan === 6) {
      return {
        planId: "plan_HKiKm3i0rCMEvy",
        price: 249.0,
        scanCount: 10,
        name: "Business Plan",
        isOneTime: false,
      };
    } else if (plan === 7) {
      return {
        planId: "plan_HKiJdlAlkuTmKU",
        price: 1199.0,
        scanCount: 10,
        name: "Yearly Plan",
        isOneTime: false,
      };
    } else if (plan === 8) {
      return {
        planId: "plan_HLToWUkmYzaE9U",
        price: 999.0,
        scanCount: 10,
        name: "Business Pro Annually",
        isOneTime: false,
      };
    } else if (plan === 9) {
      return {
        planId: "plan_HLTspRoq67GacS",
        price: 1990.0,
        scanCount: 10,
        name: "Super Pro Yearly",
        isOneTime: false,
      };
    } else if (plan === 10) {
      return {
        planId: "plan_HLU33CMIXTQr4c",
        price: 199.9,
        scanCount: 10,
        name: "Super Pro Monthly",
        isOneTime: false,
      };
    }

    throw new Error("Illegal State");
  }
}
