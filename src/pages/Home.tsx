import { Hero } from '../sections/Hero'
import { ProductView } from '../sections/ProductView'
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
      <ProductView />
      <Challenge />
      <Operational />
      <Pcaf />
      <Process />
      <Security />
      <CtaBand />
    </>
  )
}
