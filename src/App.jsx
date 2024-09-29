import { useState } from 'react'
import './App.css'

function CounterButton({ count, incrementCount }) {
  return (
    <button onClick={incrementCount}>
      count is {count}
    </button>
  )
}

function ResetButton({ resetCount }) {
  return (
    <button onClick={resetCount}>
      Reset Count
    </button>
  )
}

function App() {
  const [count, setCount] = useState(0)

  const increment = () => setCount((valueCount) => valueCount + 1)
  const resetCount = () => setCount(0)

  return (
    <>
      <p>{count}</p>
      <CounterButton count={count} incrementCount={increment} />
      <ResetButton resetCount={resetCount} />
    </>
  )
}

export default App
