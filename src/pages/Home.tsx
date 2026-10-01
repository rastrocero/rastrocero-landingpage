import { Hero } from '../sections/Hero'
import { ProductView } from '../sections/ProductView'
import { Challenge } from '../sections/Challenge'
import { EmissionsBanker } from '../sections/EmissionsBanker'
import { Process } from '../sections/Process'
import { Security } from '../sections/Security'
import { CtaBand } from '../sections/CtaBand'

export function Home() {
  return (
    <>
      <Hero />
      <ProductView />
      <Challenge />
      <EmissionsBanker />
      <Process />
      <Security />
      <CtaBand />
    </>
  )
}
