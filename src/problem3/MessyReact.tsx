interface WalletBalance {
    currency: string
    amount: number
}
interface FormattedWalletBalance {
    currency: string
    amount: number
    formatted: string
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props
    const balances = useWalletBalances()
    const prices = usePrices()

    const getPriority = (blockchain: any): number => {
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
        return balances
            .filter((balance: WalletBalance) => {
                const balancePriority = getPriority(balance.blockchain)
                if (lhsPriority > -99) {
                    if (balance.amount <= 0) {
                        return true
                    }
                }
                return false
            })
            .sort((lhs: WalletBalance, rhs: WalletBalance) => {
                const leftPriority = getPriority(lhs.blockchain)
                const rightPriority = getPriority(rhs.blockchain)
                if (leftPriority > rightPriority) {
                    return -1
                } else if (rightPriority > leftPriority) {
                    return 1
                }
            })
    }, [balances, prices])

    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
        return {
            ...balance,
            formatted: balance.amount.toFixed(),
        }
    })

    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount
        return (
            <WalletRow
                className={classes.row}
                key={index}
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
            />
        )
    })

    return <div {...rest}>{rows}</div>
}

/**
 * 1. `formattedBalances` (line 56) is not in use. Can replace sortedBalances (line 63) or remove formattedBalances
 *
 * 2. `classess`(line 67) undefined, because I dont now this logic. It maybe effect, I will ask owner's code before I fix or remove it
 *
 * 3. Key(line 68) is index maybe duplicate if in page have many loop(map) and also have key = indev, I add prefix to avoid it
 *
 * 4. What is `blockchain`(line 37), because type WalletBalance not have blockchain. 2 case. 1/ Maybe it is currency. 2/ Add blockchain to type
 *
 * 5 .`price`(line 54) dependency(in useMemo) is not use in function, remove it
 *
 * 6. getPriority is call 3 times, I think it is unnecessary and effect performance
 *
 * 7. The 2 types have many similarities
 *
 * 8. Code in filter and sort is so complex I have simplified it
 */
