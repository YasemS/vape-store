type AcceptJS = {
  dispatchData: AcceptJSDispatchData;
};

type AcceptJSDispatchData = (
  secureData: AcceptJSSecureData,
  onCardResponse: AcceptJSResponse
) => void;

type AcceptJSAuthData = {
  apiLoginID: string;
  clientKey: string;
};

type AcceptJSCardData = {
  cardNumber: string;
  month: string;
  year: string;
  cardCode: string;
  zip: string;
  fullName: string;
};

type AcceptJSSecureData = {
  authData: AcceptJSAuthData;
  cardData: AcceptJSCardData;
};

type AcceptJSOpaqueData = {
  dataDescriptor: string;
  dataValue: string;
};

type AcceptJSResponseMessage = {
  code: string;
  text: string;
};

type AcceptJSResponseCode = "Ok" | "Error";

type AcceptJSResponseData = {
  opaqueData: AcceptJSOpaqueData;
  messages: {
    resultCode: AcceptJSResponseCode;
    message: AcceptJSResponseMessage[];
  };
};

type AcceptJSResponse = (response: AcceptJSResponseData) => void;

type WindowOverride = Window & {
  Accept: AcceptJS;
};

async function dispatchData(secureData: AcceptJSSecureData) {
  return new Promise<AcceptJSResponseData>((resolve) => {
    const w = window as unknown as WindowOverride;

    w.Accept.dispatchData(secureData, (response) => resolve(response));
  });
}

export default { dispatchData };
