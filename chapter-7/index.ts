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

  get name() {
    return this._data.name;
  }

  set name(value: string) {
    this._data.name = value;
  }
}

const organization = new Orgnization({
  name: "애크미 구스베리",
  country: "GB",
});

function getOrganization() {
  return organization;
}

let result = "";

result += `<h1>${getOrganization().name}</h1>`;
getOrganization().name = "애크미 구스베리";
