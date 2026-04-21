import { AppLink } from "@/components/app-link"
import { HomepageBanner } from "@/components/sections/HomepageBanner"
import { AppContent } from "@/components/ui/app-content"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "About the Privacy Stewards of Ethereum community",
}

export default async function AboutPage() {
  const WhatWeDoItems = [
    {
      label: "Incubation",
      description:
        "We research and build open source public goods like protocols, primitives, and products.",
    },
    {
      label: "Education",
      description:
        "We create resources to help Ethereum devs and users make informed choices about privacy.",
    },
    {
      label: "Coordination",
      description:
        "We push for better privacy standards by aligning efforts across the ecosystem and guiding policy conversations.",
    },
  ]

  return (
    <>
      <div className="w-full bg-white dark:bg-transparent-gradient">
        <div className="flex flex-col gap-16 py-16">
          <AppContent className=" w-full !max-w-[860px] mx-auto">
            <div className="flex flex-col gap-16">
              <div className="flex flex-col gap-10">
                <h1 className="font-sans text-base font-bold uppercase tracking-[4px] text-black dark:text-white text-center">
                  Our Mission
                </h1>
                <span className="text-base lg:text-xl font-sans dark:text-tuatara-200 text-tuatara-500 mx-auto">
                  As Privacy Stewards of Ethereum (PSE), our mission is to
                  deliver privacy to the Ethereum ecosystem. <br />
                  <br />
                  Ethereum is becoming core infrastructure for digital identity,
                  commerce, and collaboration. But building{" "}
                  <AppLink
                    external
                    variant="blue"
                    href="https://www.activism.net/cypherpunk/manifesto.html"
                  >
                    an open society in the electronic age
                  </AppLink>{" "}
                  requires privacy that is usable, scalable, and secure.
                  <br />
                  <br />
                  Privacy is a cornerstone of freedom and an{" "}
                  <AppLink
                    href="https://vitalik.eth.limo/general/2025/04/14/privacy.html"
                    external
                    variant="blue"
                    className="w-fit inline-flex"
                  >
                    important guarantor for decentralization.
                  </AppLink>{" "}
                  It gives people the ability to organize, express, and transact
                  freely. We envision a future where digital infrastructure
                  respects privacy by default, and permissions are
                  purpose-specific, informed, uncoerced, and revocable.
                  <br /> <br />
                  {`Programmable cryptography unlocks transformative capabilities
                for digital voting, identity, transactions, and other key
                systems of coordination. But the road to privacy isn't only
                technical—it demands cultural, social, and institutional change.
                This is a collective challenge that we are committed to
                catalyzing.`}
                </span>
              </div>
              <div className="flex flex-col gap-10">
                <h2 className="font-sans text-base font-bold uppercase tracking-[4px] text-black dark:text-white text-center">
                  How we Work
                </h2>
                <span className="text-base lg:text-xl font-sans dark:text-tuatara-200 text-tuatara-500 mx-auto">
                  {`We are a team of cryptographers, mathematicians, developers,
                  designers, and coordinators working to make privacy accessible
                  by embedding programmable cryptography into Ethereum's
                  application layer. `}
                  <br />
                  <br />
                  Our work is exploratory and full stack. We focus on areas that
                  are overlooked by academia or industry like foundational
                  concepts that need clarity, implementation gaps that have
                  stalled progress, and risky ideas with uncertain but
                  transformative potential. <br />
                  <br />
                  We believe meaningful progress comes from applying research to
                  real-world needs. Our work is open source, and we maintain a
                  feedback loop so that challenges from the field can help shape
                  our focus. We aim to support the ecosystem by benchmarking new
                  primitives, systematizing knowledge, and offering credible
                  guidances for building a more private and resilient future for
                  Ethereum.
                </span>
              </div>
            </div>
          </AppContent>

          <div className="bg-cover-gradient dark:bg-anakiwa-975 dark:bg-none py-16 ">
            <AppContent className=" w-full !max-w-[860px] mx-auto">
              <div className="flex flex-col gap-10">
                <h2 className="font-sans text-base font-bold uppercase tracking-[4px] text-black dark:text-white text-center">
                  What we do
                </h2>
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 max-auto">
                  {WhatWeDoItems?.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-6 w-full lg:max-w-[400px] p-5 rounded-[10px] bg-white border border-anakiwa-300 dark:border-anakiwa-400  dark:bg-anakiwa-975"
                    >
                      <article className="flex flex-col gap-2">
                        <h6 className="font-sans text-xl font-medium text-tuatara-950 dark:text-anakiwa-400">
                          {item.label}
                        </h6>
                        <p className="font-sans text-base font-normal text-tuatara-500 dark:text-tuatara-100">
                          {item.description}
                        </p>
                      </article>
                    </div>
                  ))}
                </div>
              </div>
            </AppContent>
          </div>

          <AppContent className="w-full !max-w-[860px] mx-auto">
            <div className="flex flex-col gap-10">
              <h2 className="font-sans text-base font-bold uppercase tracking-[4px] text-black dark:text-white text-center">
                Our History
              </h2>
              <span className="text-base lg:text-xl font-sans dark:text-tuatara-200 text-tuatara-500 mx-auto">
                We began in 2018 as Applied ZKP, a team supported by the
                Ethereum Foundation to push zero-knowledge proofs from theory to
                practice. In 2021, we became Privacy & Scaling Explorations
                (PSE), expanding our scope to programmable cryptography and
                tools across the stack. In 2025, we refined our mission as
                Privacy Stewards for Ethereum, shifting our focus toward
                ecosystem impact.
              </span>
            </div>
          </AppContent>
        </div>
      </div>
      <HomepageBanner />
    </>
  )
}
