import { useEffect, useState } from 'react'
import './App.css'
import ArrowRightIcon from './components/svg/ArrowRightIcon'
import SpinnerIcon from './components/svg/SpinnerIcon'

type RateType = {
    currency: string
    date: string
    price: number
}

type SwapObjectType = {
    inputAmount: number
    inputRate: number
    outputAmount: number
    outputRate: number
}

function App() {
    const [rates, setRates] = useState<RateType[]>([])

    const [swapObject, setSwapObject] = useState<SwapObjectType>({
        inputAmount: 0,
        inputRate: 0,
        outputAmount: 0,
        outputRate: 0,
    })

    const [outputAmount, setOutputAmount] = useState<number | string>('')
    const [isError, setIsError] = useState<boolean>(false)
    const [isOnCalculating, setIsOnCaculating] = useState(false)

    useEffect(() => {
        fetchRates()
    }, [])

    const fetchRates = async () => {
        const data = await fetch('https://interview.switcheo.com/prices.json')
        const dataValue: RateType[] = await data.json()
        setRates(dataValue)
        setSwapObject({
            ...swapObject,
            inputRate: dataValue[0].price,
            outputRate: dataValue[0].price,
        })
    }

    // Handle change input
    const handleChangeInputAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Check value only number
        const regex = /^\d*\.?\d*$/
        if (!regex.test(e.target.value)) {
            setIsError(true)
            return
        } else {
            setIsError(false)
        }

        setSwapObject({ ...swapObject, inputAmount: parseFloat(e.target.value) })
    }
    const handleChangeOutputAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSwapObject({ ...swapObject, outputAmount: parseFloat(e.target.value) })
    }
    const handleChangeInputCurrency = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSwapObject({ ...swapObject, inputRate: parseFloat(e.target.value) })
    }
    const handleChangeOutputCurrency = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSwapObject({ ...swapObject, outputRate: parseFloat(e.target.value) })
    }

    // Handle submit form currency swap
    const swapMoney = async (swapObject: SwapObjectType) =>
        new Promise<number>((resolve) => {
            setOutputAmount('')
            const output = (
                (swapObject.outputRate * swapObject.inputAmount) /
                swapObject.inputRate
            ).toFixed(4)
            setTimeout(() => {
                resolve(parseFloat(output))
            }, 1000)
        })

    const handleSwapMoney = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if (isError) {
            return
        }
        setIsOnCaculating(true)
        const swappedValue = await swapMoney(swapObject)
        setOutputAmount(swappedValue)
        setIsOnCaculating(false)
    }

    return (
        <div className="flex flex-col justify-center items-center w-dvw h-[100vh] bg-amber-300">
            <h1 className="text-center font-semibold text-[60px] text-white">Currency Swap</h1>
            <div className="bg-white rounded-xl p-12 flex flex-col gap-6">
                <form className="flex gap-8 items-end justify-center">
                    <div className="group-input">
                        <label>Amount to send</label>
                        <div className="input-white">
                            <input
                                name="input-amount"
                                className="px-2 py-1 bg-transparent focus-visible:outline-none"
                                onChange={handleChangeInputAmount}
                            />
                            <select
                                name="currency"
                                className="bg-transparent focus-visible:outline-none mr-2"
                                onChange={handleChangeInputCurrency}
                                defaultValue={rates[0]?.price}
                            >
                                {rates?.map((rate, index) => {
                                    return (
                                        <option key={`rate-${index}`} value={rate.price}>
                                            {rate.currency}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="w-8 h-8">
                        <ArrowRightIcon />
                    </div>

                    <div className="group-input">
                        <label>Amount to receive</label>
                        <div className="input-white relative">
                            <input
                                disabled
                                name="output-amount"
                                className="px-2 py-1 bg-transparent focus-visible:outline-none cursor-not-allowed"
                                onChange={handleChangeOutputAmount}
                                value={outputAmount}
                            />
                            {isOnCalculating && (
                                <div className="size-[18px] absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
                                    <SpinnerIcon />
                                </div>
                            )}
                            <select
                                name="currency"
                                className="bg-transparent focus-visible:outline-none mr-2"
                                onChange={handleChangeOutputCurrency}
                            >
                                {rates?.map((rate, index) => {
                                    return (
                                        <option key={`rate-${index}`} value={rate.price}>
                                            {rate.currency}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <button
                        disabled={isError || swapObject.inputAmount === 0}
                        className="bg-emerald-400 px-2 py-1 rounded-lg disabled:bg-gray-300"
                        onClick={handleSwapMoney}
                    >
                        CONFIRM SWAP
                    </button>
                </form>
                {isError && <div className="text-red-500">Please enter number value</div>}
            </div>
        </div>
    )
}

export default App
