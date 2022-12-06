import { amountFor } from './amountFor.ts';
import { playFor } from './playFor.ts';
import totalAmount from './totalAmount.ts';
import { totalVolumeCredits } from './totalVolumeCredits.ts';
import { IInvoice, PlayPerformance, IPlays } from './types.ts';
import { usd } from './usd.ts';
import { volumeCreditsFor } from './volumeCreditsFor.ts';

export function statement(invoice: IInvoice, plays: IPlays) {
  const statementData: IInvoice = {
    customer: '',
    performances: [],
    totalAmount: 0,
  };

  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);

  function enrichPerformance(aPerformance: PlayPerformance) {
    const result: PlayPerformance = Object.assign({}, aPerformance);

    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);

    return result;
  }

  return renderPlaintText(statementData, plays);
}

function renderPlaintText(data: IInvoice, plays: IPlays) {
  console.log('💵 generating plain text statement 💵');
  let result = `Statement for ${data.customer}\n`;

  for (const perf of data.performances) {
    console.log(perf);

    result += `${perf.play.name}: ${usd(perf.amount)} (${perf.amount} seats)\n`;
  }

  result += `Amount owed is ${usd(totalAmount(data))}\n`;
  result += `You earned ${totalVolumeCredits(data)} credits\n`;

  return result;
}
