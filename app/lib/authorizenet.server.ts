import authorizenet, { type APIContracts as APIContractsT } from "authorizenet";

const { APIContracts, APIControllers } = authorizenet;

type Authentication = {
  loginId: string;
  transactionKey: string;
};

type Data = {
  descriptor: string;
  value: string;
};

type TransactionResponse =
  | {
      error: string;
    }
  | {
      success: true;
      id: string;
    };

function getMerchantAuth(auth: Authentication) {
  // 1. Merchant auth
  const merchantAuthenticationType =
    new APIContracts.MerchantAuthenticationType();

  merchantAuthenticationType.setName(auth.loginId);
  merchantAuthenticationType.setTransactionKey(auth.transactionKey);

  return merchantAuthenticationType;
}

function getOpaqueData(data: Data) {
  // 2. Tokenized payment data
  const opaqueData = new APIContracts.OpaqueDataType();

  opaqueData.setDataDescriptor(data.descriptor);
  opaqueData.setDataValue(data.value);

  return opaqueData;
}

function getPaymentType(opaqueData: APIContractsT.OpaqueDataType) {
  const paymentType = new APIContracts.PaymentType();

  paymentType.setOpaqueData(opaqueData);

  return paymentType;
}

function getTransactionRequest(paymentType: APIContractsT.PaymentType) {
  const transactionRequest = new APIContracts.TransactionRequestType();

  transactionRequest.setTransactionType("authCaptureTransaction");
  transactionRequest.setPayment(paymentType);

  return transactionRequest;
}

function getCreateRequest(
  merchantAuth: APIContractsT.MerchantAuthenticationType,
  transactionRequest: APIContractsT.TransactionRequestType
) {
  const createRequest = new APIContracts.CreateTransactionRequest();

  createRequest.setMerchantAuthentication(merchantAuth);
  createRequest.setTransactionRequest(transactionRequest);

  return createRequest;
}

async function getTransactionResponse(
  createRequest: APIContractsT.CreateTransactionRequest
): Promise<TransactionResponse> {
  const ctrl = new APIControllers.CreateTransactionController(
    createRequest.getJSON()
  );

  ctrl.setEnvironment("https://api.authorize.net/xml/v1/request.api");

  return new Promise((resolve) => {
    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();
      const response = new APIContracts.CreateTransactionResponse(apiResponse);

      if (response != null && response.getMessages().getResultCode() === "Ok") {
        const transactionResponse = response.getTransactionResponse();

        if (
          transactionResponse != null &&
          transactionResponse.getMessages() != null
        ) {
          resolve({ success: true, id: transactionResponse.getTransId() });
        } else {
          resolve({
            error:
              transactionResponse.getErrors().error[0]?.errorText ||
              "Transaction failed",
          });
        }
      } else {
        console.error(
          "API error:",
          response.getMessages().getMessage()[0].getText()
        );

        resolve({
          error:
            response.getMessages().getMessage()[0].getText() || "API Error",
        });
      }
    });
  });
}

async function createPayment(amount: number, data: Data, auth: Authentication) {
  const merchantAuth = getMerchantAuth(auth);
  const opaqueData = getOpaqueData(data);
  const paymentType = getPaymentType(opaqueData);

  const transactionRequest = getTransactionRequest(paymentType);

  transactionRequest.setAmount(amount);

  const createRequest = getCreateRequest(merchantAuth, transactionRequest);

  const transaction = await getTransactionResponse(createRequest);

  return transaction;
}

export default { createPayment };
