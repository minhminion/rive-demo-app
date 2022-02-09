import { Fragment, useEffect } from 'react'
import {
  Alignment,
  Fit,
  Layout,
  useRive,
  useStateMachineInput,
} from 'rive-react'

const RiveScreen = () => {
  const STATE_MACHINE_NAME = 'State Machine'
  const INPUT_NAME = 'Level'
  const MAX_INPUT_VALUE = 100
  const SCROLL_HEIGHT = 4000

  const { rive, RiveComponent } = useRive({
    src: 'water_bar.riv',
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
    artboard: 'New Artboard',
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  })

  const levelInput = useStateMachineInput(rive, STATE_MACHINE_NAME, INPUT_NAME)

  useEffect(() => {
    window.addEventListener('scroll', (event) => {
      const tree = document.getElementById('tree')?.getBoundingClientRect()
      const treeStart = tree ? tree.top : 0

      if (treeStart === 0) {
        const value = (window.scrollY - 200) / (SCROLL_HEIGHT / MAX_INPUT_VALUE)
        levelInput && (levelInput.value = value)
      }
    })
  }, [levelInput])

  return (
    <Fragment>
      <div style={{ height: '200px' }}> </div>
      <div>
        <div
          id="tree"
          style={{ height: '100vh', width: '100%', position: 'sticky', top: 0 }}
        >
          <RiveComponent />
        </div>
        <div style={{ height: `${SCROLL_HEIGHT}px` }}></div>
      </div>
      <div
        style={{
          height: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            })
          }
        >
          GO TO TOP
        </button>
      </div>
    </Fragment>
  )
}

export default RiveScreen
