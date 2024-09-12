import React from 'react'
import Wave from 'react-wavify'

const Wave = () => (
  <Wave fill='#f79902'
        paused={false}
        style={{ display: 'flex' }}
        options={{
          height: 20,
          amplitude: 20,
          speed: 0.15,
          points: 3
        }}
  />
)

export default Wave;