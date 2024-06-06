interface WalletBalance {
    currency: string
    amount: number
    blockchain: string
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = ({ children, ...rest }: Props) => {
    const balances = useWalletBalances()
    const prices = usePrices()

    const getPriority = (blockchain: string): number => {
        switch (blockchain) {
            case 'Osmosis':
                return 100
            case 'Ethereum':
                return 50
            case 'Arbitrum':
                return 30
            case 'Zilliqa':
                return 20
            case 'Neo':
                return 20
            default:
                return -99
        }
    }

    const sortedBalances = useMemo(() => {
        const balancesWithPriority = balances.map((balance: WalletBalance) => ({
            ...balance,
            priority: getPriority(balance.blockchain),
        }))

        return balancesWithPriority
            .filter((balance) => balance.priority > -99 && balance.amount <= 0)
            .sort((lhs, rhs) => rhs.priority - lhs.priority)
    }, [balances])

    const rows = sortedBalances.map((balance: WalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount
        return (
            <WalletRow
                className={classes.row}
                key={`wallet-${index}`}
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.amount.toFixed()}
            />
        )
    })

    return <div {...rest}>{rows}</div>
}
