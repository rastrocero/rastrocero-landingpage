import { Hero } from '../sections/Hero'
import { Facts } from '../sections/Facts'
import { Challenge } from '../sections/Challenge'
import { Operational } from '../sections/Operational'
import { Pcaf } from '../sections/Pcaf'
import { Process } from '../sections/Process'
import { Security } from '../sections/Security'
import { CtaBand } from '../sections/CtaBand'

export function Home() {
  return (
    <>
      <Hero />
      <Facts />
      <Challenge />
      <Operational />
      <Pcaf />
      <Process />
      <Security />
      <CtaBand />
    </>
  )
}
