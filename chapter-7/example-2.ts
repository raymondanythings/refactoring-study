import customerData from "./customer-user.json";

customerData["1920"].usages["2016"]["1"] = 500;

function getCustomerData(customerId: string, laterYear: string, month: string) {
  return customerData[customerId as keyof typeof customerData].usages[
    laterYear as keyof (typeof customerData)[keyof typeof customerData]["usages"]
  ][
    month as keyof (typeof customerData)[keyof typeof customerData]["usages"][keyof (typeof customerData)[keyof typeof customerData]["usages"]]
  ];
}

function compareUsage(customerId: string, laterYear: string, month: string) {
  const later = getCustomerData(customerId, laterYear, month);
  const earlier = getCustomerData(customerId, laterYear, month);
  return {
    laterAmount: later,
    change: later - earlier,
  };
}
