import { createTmsClient } from "@shared/tms/tmsClientFactory";

export const tmsResolvers = {
  Query: {
    tmsStatus: async (_: any, args: { id: string }) => {
      const client = createTmsClient();
      const res = await client.getShipmentStatus(args.id, "json");
      return JSON.stringify(res);
    },
    tmsHistory: async (_: any, args: { id: string }) => {
      const client = createTmsClient();
      const res = await client.getShipmentHistory(args.id, "json");
      return JSON.stringify(res);
    }
  }
};
