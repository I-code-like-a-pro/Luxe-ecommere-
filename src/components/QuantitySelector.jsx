import { useState } from 'react'

const QuantitySelector = ({ quantity: propQuantity, setQuantity: propSetQuantity }) => {
    const [internalQuantity, setInternalQuantity] = useState(1)
    const quantity = propQuantity ?? internalQuantity
    const setQuantity = propSetQuantity ?? setInternalQuantity

    const decrease = () => {
        if (quantity <= 0) return
        setQuantity(quantity - 1)
    }

    const increase = () => setQuantity(quantity + 1)

    const btnClass =
        'border border-border w-8 flex items-center justify-center h-8 font-medium hover:bg-sec'

    return (
        <div className="flex gap-4 my-2">
            <button onClick={decrease} className={btnClass}>
                −
            </button>
            <div className="flex items-center justify-center border border-border px-3 py-1 gap-2 group">
                <span className="mx-1">{quantity}</span>
                <div className="flex flex-col items-center leading-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button onClick={increase} className="text-[10px]">
                        ▲
                    </button>
                    <button onClick={decrease} className="text-[10px]">
                        ▼
                    </button>
                </div>
            </div>
            <button className={btnClass} onClick={increase}>
                +
            </button>
        </div>
    )
}

export default QuantitySelector
