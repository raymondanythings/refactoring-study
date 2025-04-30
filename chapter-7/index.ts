class Orgnization {
  public _data = {
    name: "",
    country: "",
  };

  constructor(data: {
    name: string;
    country: string;
  }) {
    this._data = data;
  }
}

// const organization = { name: "애크미 구스베리", country: "GB" };
const organization = new Orgnization({
  name: "애크미 구스베리",
  country: "GB",
});

function getRawDataOfOrganization() {
  return organization._data;
}

function getOrganization() {
  return organization;
}

let result = "";

result += `<h1>${getRawDataOfOrganization().name}</h1>`;
getOrganization()._data.name = "애크미 구스베리";
