import { amountFor } from './amountFor.ts';
import { playFor } from './playFor.ts';
import { totalVolumeCredits } from './totalVolumeCredits.ts';
import { Invoice, Plays } from './types.ts';
import { usd } from './usd.ts';

export function statement(invoice: Invoice, plays: Plays) {
  const statementData = {};
  return renderPlaintText(statementData, invoice, plays);
}

function renderPlaintText(data, invoice: Invoice, plays: Plays) {
  console.log('💵 generating plain text statement 💵');
  let totalAmount = 0;
  let result = `Statement for ${invoice.customer}\n`;

  for (const perf of invoice.performances) {
    result += `${playFor(perf).name}: ${usd(amountFor(perf, playFor(perf)))} (${perf.audience} seats)\n`;
    totalAmount += amountFor(perf, playFor(perf));
  }

  result += `Amount owed is ${usd(totalAmount)}\n`;
  result += `You earned ${totalVolumeCredits(invoice)} credits\n`;

  return result;
}
