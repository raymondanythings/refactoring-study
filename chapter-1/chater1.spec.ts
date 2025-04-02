import { statement } from "./index";

import invoices from "./invoices.json";
import plays from "./plays.json";

describe("Statement", () => {
  it("청구서에 대해 올바른 청구서를 반환해야 한다", () => {
    const result = statement(invoices[0], plays);

    expect(result).toContain("청구 내역 (고객명: BigCo)");
    expect(result).toContain("Hamlet: $650.00 (55석)");
    expect(result).toContain("As You Like It: $580.00 (35석)");
    expect(result).toContain("Othello: $500.00 (40석)");
    expect(result).toContain("총액 $1,730.00");
    expect(result).toContain("적립 포인트 47점");
  });

  it("공연이 비어 있을 때 처리해야 한다", () => {
    const invoice = {
      customer: "John Doe",
      performances: [],
    };

    const plays = {};

    const result = statement(invoice, plays);
    expect(result).toBe(
      "청구 내역 (고객명: John Doe)\n" + "총액 $0.00\n" + "적립 포인트 0점\n",
    );
  });

  it("알 수 없는 연극 유형에 대해 오류를 발생시켜야 한다", () => {
    const invoice = {
      customer: "John Doe",
      performances: [{ playID: "unknown", audience: 10 }],
    };

    const plays = {
      unknown: { name: "Unknown Play", type: "unknown" },
    };

    expect(() => statement(invoice, plays)).toThrow("알 수 없는 장르: unknown");
  });

  it("적립 포인트를 올바르게 계산해야 한다", () => {
    const invoice = {
      customer: "Jane Doe",
      performances: [
        { playID: "hamlet", audience: 35 },
        { playID: "as-like", audience: 20 },
      ],
    };

    const plays = {
      hamlet: { name: "Hamlet", type: "tragedy" },
      "as-like": { name: "As You Like It", type: "comedy" },
    };

    const result = statement(invoice, plays);
    expect(result).toContain("적립 포인트 9점");
  });

  it("희극 관객 5명마다 추가 포인트를 제공해야 한다", () => {
    const invoice = {
      customer: "Jane Doe",
      performances: [{ playID: "as-like", audience: 25 }],
    };

    const plays = {
      "as-like": { name: "As You Like It", type: "comedy" },
    };

    const result = statement(invoice, plays);
    expect(result).toContain("적립 포인트 5점");
  });
});
