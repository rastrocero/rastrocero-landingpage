import { Hero } from '../sections/Hero'
import { Challenge } from '../sections/Challenge'
import { Platform } from '../sections/Platform'
import { Bankers, BankersProcess, Vision } from '../sections/Vision'
import { Security } from '../sections/Security'
import { CtaBand } from '../sections/CtaBand'

/* What a bank can try today (Platform, with Emissions Banker), then the team we are building (Vision → Bankers → Process). */
export function Home() {
  return (
    <>
      <Hero />
      <Challenge />
      <Platform />
      <Vision />
      <Bankers />
      <BankersProcess />
      <Security />
      <CtaBand />
    </>
  )
}
