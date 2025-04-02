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

  it("비극 공연의 가격을 올바르게 계산해야 한다", () => {
    const invoice = {
      customer: "Test Customer",
      performances: [{ playID: "hamlet", audience: 20 }],
    };

    const plays = {
      hamlet: { name: "Hamlet", type: "tragedy" },
    };

    const result = statement(invoice, plays);
    expect(result).toContain("Hamlet: $400.00 (20석)");
    expect(result).toContain("총액 $400.00");
  });

  it("비극 공연의 가격을 관객 30명 초과 시 추가 요금으로 계산해야 한다", () => {
    const invoice = {
      customer: "Test Customer",
      performances: [{ playID: "hamlet", audience: 40 }],
    };

    const plays = {
      hamlet: { name: "Hamlet", type: "tragedy" },
    };

    const result = statement(invoice, plays);
    expect(result).toContain("Hamlet: $500.00 (40석)");
    expect(result).toContain("총액 $500.00");
  });

  it("희극 공연의 가격을 올바르게 계산해야 한다", () => {
    const invoice = {
      customer: "Test Customer",
      performances: [{ playID: "as-like", audience: 15 }],
    };

    const plays = {
      "as-like": { name: "As You Like It", type: "comedy" },
    };

    const result = statement(invoice, plays);
    expect(result).toContain("As You Like It: $345.00 (15석)");
    expect(result).toContain("총액 $345.00");
  });

  it("희극 공연의 가격을 관객 20명 초과 시 추가 요금으로 계산해야 한다", () => {
    const invoice = {
      customer: "Test Customer",
      performances: [{ playID: "as-like", audience: 25 }],
    };

    const plays = {
      "as-like": { name: "As You Like It", type: "comedy" },
    };

    const result = statement(invoice, plays);
    expect(result).toContain("As You Like It: $500.00 (25석)");
    expect(result).toContain("총액 $500.00");
  });

  it("관객이 30명 이하인 경우 추가 적립 포인트가 없어야 한다", () => {
    const invoice = {
      customer: "Test Customer",
      performances: [{ playID: "hamlet", audience: 30 }],
    };

    const plays = {
      hamlet: { name: "Hamlet", type: "tragedy" },
    };

    const result = statement(invoice, plays);
    expect(result).toContain("적립 포인트 0점");
  });

  it("여러 공연의 총액을 정확하게 합산해야 한다", () => {
    const invoice = {
      customer: "Test Customer",
      performances: [
        { playID: "hamlet", audience: 40 },
        { playID: "as-like", audience: 25 },
        { playID: "othello", audience: 35 },
      ],
    };

    const plays = {
      hamlet: { name: "Hamlet", type: "tragedy" },
      "as-like": { name: "As You Like It", type: "comedy" },
      othello: { name: "Othello", type: "tragedy" },
    };

    const result = statement(invoice, plays);

    expect(result).toContain("총액 $1,450.00");
  });

  it("여러 공연의 적립 포인트를 정확하게 합산해야 한다", () => {
    const invoice = {
      customer: "Test Customer",
      performances: [
        { playID: "hamlet", audience: 40 },
        { playID: "as-like", audience: 25 },
      ],
    };

    const plays = {
      hamlet: { name: "Hamlet", type: "tragedy" },
      "as-like": { name: "As You Like It", type: "comedy" },
    };

    const result = statement(invoice, plays);
    expect(result).toContain("적립 포인트 15점");
  });
});
