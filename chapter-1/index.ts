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

type PerformanceWithPlay = Performance & { play: PlayInfo };

type StatementData = {
  customer: string;
  performances: PerformanceWithPlay[];
};

function statement(invoice: Invoice, plays: Plays) {
  const statementData: StatementData = {
    customer: invoice.customer,
    performances: invoice.performances.map(enrichPerformance),
  };
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);

  return renderPlainText(statementData);

  function enrichPerformance(aPerformance: Performance): PerformanceWithPlay {
    const result: PerformanceWithPlay = Object.assign(
      { play: { name: "", type: "" } },
      aPerformance,
    );
    result.play = playFor(result);
    return result;
  }

  function usd(aNumber: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber / 100);
  }

  function playFor(aPerformance: Performance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance: PerformanceWithPlay) {
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
  }

  function volumeCreditsFor(aPerformance: Performance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === playFor(aPerformance).type)
      result += Math.floor(aPerformance.audience / 5);
    return result;
  }

  function totalVolumeCredits() {
    let volumeCredits = 0;

    for (const perf of invoice.performances) {
      volumeCredits += volumeCreditsFor(perf);
    }

    return volumeCredits;
  }

  function totalAmount() {
    let totalAmount = 0;

    for (const perf of statementData.performances) {
      totalAmount += amountFor(perf);
    }

    return totalAmount;
  }

  function renderPlainText(data: StatementData) {
    let result = `청구 내역 (고객명: ${data.customer})\n`;

    for (const perf of data.performances) {
      result += `${perf.play.name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
    }

    result += `총액 ${usd(totalAmount())}\n`;
    result += `적립 포인트 ${totalVolumeCredits()}점\n`;

    return result;
  }
}

export { statement };
