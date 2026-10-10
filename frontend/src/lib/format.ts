const LOCALE = 'es-GT'

const amountFormatter = new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const dateFormatter = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeStyle: 'short' })
const numberFormatter = new Intl.NumberFormat(LOCALE)

export const CURRENCY_SYMBOL = 'Q.'

export const formatCurrency = (value: number) => `${CURRENCY_SYMBOL} ${amountFormatter.format(value)}`
export const formatDateTime = (value: string) => dateFormatter.format(new Date(value))
export const formatNumber = (value: number) => numberFormatter.format(value)
