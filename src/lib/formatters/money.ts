export function formatMinor(amountMinor: string | number | bigint, currency = 'ETB') {
  const amount = Number(amountMinor) / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(amount).replace('ETB', 'ETB');
}
