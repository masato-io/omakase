import { authExchange } from "@urql/exchange-auth";
import { getMachineUserToken } from "@/lib/auth";

export const dumbAuthExchange = authExchange(async (utils) => {
  const { access_token } = await getMachineUserToken();

  return {
    addAuthToOperation: (operation) => {
      return utils.appendHeaders(operation, {
        Authorization: `Bearer ${access_token}`,
      });
    },
    didAuthError: () => false,
    refreshAuth: () => Promise.resolve(),
  };
});
