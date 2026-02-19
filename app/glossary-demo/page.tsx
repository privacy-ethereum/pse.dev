import { GlossaryTerm } from "@/components/ui/glossary-term"
import { getAllGlossaryTerms } from "@/data/glossary"

export const metadata = {
  title: "Glossary Demo - PSE",
  description: "Technical terms glossary with hover tooltips",
}

export default function GlossaryDemoPage() {
  const allTerms = getAllGlossaryTerms()

  // Group terms by category
  const termsByCategory = allTerms.reduce((acc, term) => {
    const category = term.category || "Other"
    if (!acc[category]) acc[category] = []
    acc[category].push(term)
    return acc
  }, {} as Record<string, typeof allTerms>)

  return (
    <div className="min-h-screen bg-white dark:bg-anakiwa-975 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-tuatara-950 dark:text-white mb-4">
          Glossary Demo
        </h1>
        <p className="text-tuatara-600 dark:text-tuatara-300 mb-8">
          Hover over the underlined terms to see their definitions.
        </p>

        {/* Example paragraph with glossary terms */}
        <div className="bg-tuatara-50 dark:bg-anakiwa-950 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-semibold text-tuatara-900 dark:text-white mb-4">
            Example Usage
          </h2>
          <p className="text-tuatara-700 dark:text-tuatara-200 leading-relaxed">
            <GlossaryTerm term="pse">PSE</GlossaryTerm> is focused on building
            privacy-preserving tools using technologies like{" "}
            <GlossaryTerm term="zero-knowledge">zero-knowledge proofs</GlossaryTerm>.
            Projects like <GlossaryTerm term="semaphore">Semaphore</GlossaryTerm> and{" "}
            <GlossaryTerm term="bandada">Bandada</GlossaryTerm> enable anonymous
            group membership, while <GlossaryTerm term="tlsn">TLSNotary</GlossaryTerm>{" "}
            provides data verification without revealing everything.
          </p>
          <p className="text-tuatara-700 dark:text-tuatara-200 leading-relaxed mt-4">
            Privacy networks like <GlossaryTerm term="tor">Tor</GlossaryTerm> protect
            users when making <GlossaryTerm term="rpc">RPC</GlossaryTerm> calls to
            blockchain nodes. Advanced cryptographic techniques like{" "}
            <GlossaryTerm term="fhe">FHE</GlossaryTerm> and{" "}
            <GlossaryTerm term="mpc">MPC</GlossaryTerm> enable computation on
            encrypted data.
          </p>
        </div>

        {/* Full glossary list */}
        <h2 className="text-2xl font-bold text-tuatara-950 dark:text-white mb-6">
          All Terms
        </h2>

        {Object.entries(termsByCategory).map(([category, terms]) => (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-semibold text-anakiwa-600 dark:text-anakiwa-400 mb-3">
              {category}
            </h3>
            <div className="grid gap-2">
              {terms.map((entry) => (
                <div
                  key={entry.term}
                  className="flex items-start gap-2 p-3 rounded-lg bg-tuatara-50 dark:bg-anakiwa-950"
                >
                  <GlossaryTerm term={entry.term.toLowerCase().replace(/\s+/g, "-")}>
                    <span className="font-medium text-tuatara-900 dark:text-white">
                      {entry.term}
                    </span>
                  </GlossaryTerm>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
