interface PlayInfo {
  name: string;
  type: string;
}

interface Performance {
  playID: string;
  audience: number;
}

interface Invoice {
  customer: string;
  performances: Performance[];
}

type Plays = Record<string, PlayInfo>;

function usd(aNumber: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}

function statement(invoice: Invoice, plays: Plays) {
  const playFor = (aPerformance: Performance) => {
    return plays[aPerformance.playID];
  };

  const amountFor = (aPerformance: Performance) => {
    let result = 0;

    switch (playFor(aPerformance).type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
    }

    return result;
  };

  function volumeCreditsFor(aPerformance: Performance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === playFor(aPerformance).type)
      result += Math.floor(aPerformance.audience / 5);
    return result;
  }

  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

  for (const aPerformance of invoice.performances) {
    // 이 줄은 청구 내역을 출력한다.
    result += `${playFor(aPerformance).name}: ${usd(amountFor(aPerformance))} (${aPerformance.audience}석)\n`;
    totalAmount += amountFor(aPerformance);
  }

  for (const perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);
  }

  result += `총액 ${usd(totalAmount)}\n`;
  result += `적립 포인트 ${volumeCredits}점\n`;

  return result;
}

export { statement };
