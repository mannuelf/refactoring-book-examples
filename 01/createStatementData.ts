import { amountFor } from './amountFor.ts';
import { playFor } from './playFor.ts';
import totalAmount from './totalAmount.ts';
import { totalVolumeCredits } from './totalVolumeCredits.ts';
import type { Invoice, PlayPerformance, Plays } from './types.ts';
import { volumeCreditsFor } from './volumeCreditsFor.ts';

class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }
}

function enrichPerformance(aPerformance: PlayPerformance) {
  const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
  const result: PlayPerformance = Object.assign({}, aPerformance);

  result.play = playFor(result);
  result.amount = amountFor(result);
  result.volumeCredits = volumeCreditsFor(result);

  return result;
}

export function createStatementData(invoice: Invoice, plays: Plays) {
  const statementData: Invoice = {
    customer: '',
    performances: [],
    totalAmount: 0,
    totalVolumeCredits: 0,
  };

  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);

  return statementData;
}
