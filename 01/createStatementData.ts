import { PerformanceCalculator } from './PerformanceCalculator.ts';
import { playFor } from './playFor.ts';
import totalAmount from './totalAmount.ts';
import { totalVolumeCredits } from './totalVolumeCredits.ts';
import type { Invoice, Play, PlayPerformance, Plays } from './types.ts';

function enrichPerformance(aPerformance: PlayPerformance) {
  const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
  const result: PlayPerformance = Object.assign({}, aPerformance);

  result.play = playFor(result);
  result.amount = calculator.amount;
  result.volumeCredits = calculator.volumeCredits;

  return result;
}

function createPerformanceCalculator(aPerformance: PlayPerformance, aPlay: Play) {
  switch (aPlay.type) {
    case 'tragedy':
      return new TragedyCalculator(aPerformance, aPlay);
    case 'comedy':
      return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`unknown type: ${aPlay.type}`);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}
class ComedyCalculator extends PerformanceCalculator {}

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
