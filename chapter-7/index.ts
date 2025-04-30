class Orgnization {
  private _name: string;
  private _country: string;

  constructor(data: {
    name: string;
    country: string;
  }) {
    this._name = data.name;
    this._country = data.country;
  }

  get name() {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get country() {
    return this._country;
  }

  set country(value: string) {
    this._country = value;
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
