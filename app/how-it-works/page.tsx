'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ComparisonMetric {
  name: string;
  description: string;
  signalValue: string | number;
  telegramValue: string | number;
  signalScore: number; // 0-100, used for gradient
  telegramScore: number;
}

interface ProjectComparison {
  id: string;
  name: string;
  privacyTech: string[];
  privacyModel: 'mandatory' | 'opt-in' | 'none';
  score: number;
  ecosystem: string;
}

const messagingMetrics: ComparisonMetric[] = [
  {
    name: 'End-to-End Encryption',
    description: 'Messages encrypted so only sender/receiver can read',
    signalValue: 'Always On',
    telegramValue: 'Opt-in (Secret Chats)',
    signalScore: 100,
    telegramScore: 40,
  },
  {
    name: 'Metadata Protection',
    description: 'Hides who talks to whom',
    signalValue: 'Sealed Sender',
    telegramValue: 'None',
    signalScore: 90,
    telegramScore: 10,
  },
  {
    name: 'Open Source',
    description: 'Code publicly auditable',
    signalValue: 'Full Client + Server',
    telegramValue: 'Client Only',
    signalScore: 100,
    telegramScore: 50,
  },
  {
    name: 'Post-Quantum Ready',
    description: 'Resistant to quantum computers',
    signalValue: 'PQXDH (2023)',
    telegramValue: 'No',
    signalScore: 95,
    telegramScore: 0,
  },
  {
    name: 'Group Chat Privacy',
    description: 'Privacy in group conversations',
    signalValue: 'Encrypted + Sealed',
    telegramValue: 'Not E2E',
    signalScore: 95,
    telegramScore: 15,
  },
];

const ethProjects: ProjectComparison[] = [
  { id: 'tornado-cash', name: 'Tornado Cash', privacyTech: ['zk-snarks', 'nullifiers'], privacyModel: 'opt-in', score: 85, ecosystem: 'ethereum' },
  { id: 'semaphore', name: 'Semaphore', privacyTech: ['zk-snarks', 'anonymous-credentials'], privacyModel: 'opt-in', score: 80, ecosystem: 'ethereum' },
  { id: 'zksync', name: 'zkSync', privacyTech: ['zk-snarks', 'plonk'], privacyModel: 'none', score: 45, ecosystem: 'ethereum' },
  { id: 'miden', name: 'Miden', privacyTech: ['zk-starks'], privacyModel: 'opt-in', score: 75, ecosystem: 'ethereum' },
  { id: 'fluidkey', name: 'Fluidkey', privacyTech: ['stealth-addresses'], privacyModel: 'opt-in', score: 70, ecosystem: 'ethereum' },
];

const privacyCoins: ProjectComparison[] = [
  { id: 'monero', name: 'Monero', privacyTech: ['ring-signatures', 'stealth-addresses', 'ringct'], privacyModel: 'mandatory', score: 95, ecosystem: 'cryptonote' },
  { id: 'zcash', name: 'Zcash', privacyTech: ['zk-snarks', 'halo2'], privacyModel: 'opt-in', score: 80, ecosystem: 'bitcoin-fork' },
  { id: 'firo', name: 'Firo', privacyTech: ['lelantus', 'spark'], privacyModel: 'opt-in', score: 75, ecosystem: 'bitcoin-fork' },
  { id: 'iron-fish', name: 'Iron Fish', privacyTech: ['zk-snarks', 'sapling'], privacyModel: 'mandatory', score: 85, ecosystem: 'standalone' },
];

// Color gradient from red (0) to yellow (50) to green (100)
function getScoreColor(score: number): string {
  if (score >= 80) return '#a6e3a1'; // Green
  if (score >= 60) return '#f9e2af'; // Yellow
  if (score >= 40) return '#fab387'; // Orange
  return '#f38ba8'; // Red
}

function getScoreGradient(score: number): string {
  const green = Math.min(255, Math.round((score / 100) * 255));
  const red = Math.min(255, Math.round(((100 - score) / 100) * 255));
  return `rgb(${red}, ${green}, 100)`;
}

export default function HowItWorksPage() {
  const [activeSection, setActiveSection] = useState<string>('messaging');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#cdd6f4]">
      {/* Header */}
      <header className="border-b border-[#252525] py-6">
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/" className="text-[#94e2d5] hover:underline text-sm mb-4 inline-block">
            &larr; Back to Research
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">How Privacy Technology Works</h1>
          <p className="text-[#a6adc8]">
            Understanding privacy through comparison. See how different projects protect (or don't protect) your data.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        {/* Navigation */}
        <nav className="flex flex-wrap gap-2 border-b border-[#252525] pb-4">
          {[
            { id: 'messaging', label: 'Messaging: Signal vs Telegram' },
            { id: 'ethereum', label: 'Ethereum Ecosystem' },
            { id: 'coins', label: 'Privacy Coins' },
            { id: 'bridges', label: 'Cross-Ecosystem Bridges' },
          ].map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                activeSection === section.id
                  ? 'bg-[#94e2d5] text-[#1a1a1a] font-medium'
                  : 'bg-[#1a1a1a] text-[#888] hover:bg-[#252525]'
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>

        {/* Section: Messaging */}
        {activeSection === 'messaging' && (
          <section className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Signal */}
              <div className="bg-[#1a1a1a] border border-[#252525] rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#3a76f0] rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Signal</h3>
                    <p className="text-sm text-[#a6e3a1]">Privacy by Default</p>
                  </div>
                </div>
                <p className="text-[#888] text-sm mb-4">
                  Built by cryptographers. All messages are end-to-end encrypted with the Signal Protocol.
                  Metadata protection via Sealed Sender. Post-quantum resistant since 2023.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-[#fab387] text-[#1a1a1a] text-xs rounded">Signal Protocol</span>
                  <span className="px-2 py-1 bg-[#f38ba8] text-[#1a1a1a] text-xs rounded">SGX TEE</span>
                  <span className="px-2 py-1 bg-[#f9e2af] text-[#1a1a1a] text-xs rounded">Post-Quantum</span>
                </div>
              </div>

              {/* Telegram */}
              <div className="bg-[#1a1a1a] border border-[#252525] rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#0088cc] rounded-lg flex items-center justify-center text-white font-bold text-xl">T</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Telegram</h3>
                    <p className="text-sm text-[#f9e2af]">Convenience First</p>
                  </div>
                </div>
                <p className="text-[#888] text-sm mb-4">
                  Popular for features and speed. Regular chats are NOT end-to-end encrypted - Telegram can read them.
                  "Secret Chats" offer E2E but are opt-in and rarely used.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-[#89b4fa] text-[#1a1a1a] text-xs rounded">MTProto</span>
                  <span className="px-2 py-1 bg-[#6c7086] text-white text-xs rounded">E2E Opt-in Only</span>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-[#1a1a1a] border border-[#252525] rounded-lg overflow-hidden">
              <div className="p-4 border-b border-[#252525]">
                <h3 className="font-semibold text-white">Privacy Metric Comparison</h3>
                <p className="text-xs text-[#666]">Color indicates privacy strength: <span className="text-[#a6e3a1]">green</span> = strong, <span className="text-[#f38ba8]">red</span> = weak</p>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-[#151515]">
                  <tr>
                    <th className="text-left p-4 text-[#888]">Metric</th>
                    <th className="text-center p-4 text-[#888]">Signal</th>
                    <th className="text-center p-4 text-[#888]">Telegram</th>
                  </tr>
                </thead>
                <tbody>
                  {messagingMetrics.map((metric, i) => (
                    <tr key={metric.name} className={i % 2 === 0 ? 'bg-[#0f0f0f]' : ''}>
                      <td className="p-4">
                        <div className="font-medium text-white">{metric.name}</div>
                        <div className="text-xs text-[#666]">{metric.description}</div>
                      </td>
                      <td className="p-4 text-center">
                        <div
                          className="inline-block px-3 py-1 rounded text-[#1a1a1a] text-xs font-medium"
                          style={{ backgroundColor: getScoreColor(metric.signalScore) }}
                        >
                          {metric.signalValue}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div
                          className="inline-block px-3 py-1 rounded text-[#1a1a1a] text-xs font-medium"
                          style={{ backgroundColor: getScoreColor(metric.telegramScore) }}
                        >
                          {metric.telegramValue}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-[#151515] border border-[#333] rounded-lg p-4">
              <p className="text-[#f9e2af] text-sm">
                <strong>Key Insight:</strong> Telegram prioritizes features and growth over privacy. If privacy matters,
                Signal is the clear choice. However, Telegram's reach means many privacy-sensitive conversations still
                happen there - understand the tradeoffs.
              </p>
            </div>
          </section>
        )}

        {/* Section: Ethereum */}
        {activeSection === 'ethereum' && (
          <section className="space-y-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-[#a6adc8]">
                Ethereum is public by default - all transactions are visible on-chain. Privacy solutions add layers
                to hide amounts, addresses, or transaction graphs. Different approaches offer different tradeoffs.
              </p>
            </div>

            <div className="grid gap-4">
              {ethProjects.map(project => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="bg-[#1a1a1a] border border-[#252525] rounded-lg p-4 hover:border-[#94e2d5] transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-2 h-12 rounded"
                        style={{ backgroundColor: getScoreColor(project.score) }}
                      />
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-[#94e2d5]">{project.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {project.privacyTech.map(tech => (
                            <span key={tech} className="text-xs text-[#888]">{tech}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-lg font-bold"
                        style={{ color: getScoreColor(project.score) }}
                      >
                        {project.score}
                      </div>
                      <div className={`text-xs ${
                        project.privacyModel === 'mandatory' ? 'text-[#a6e3a1]' :
                        project.privacyModel === 'opt-in' ? 'text-[#f9e2af]' : 'text-[#f38ba8]'
                      }`}>
                        {project.privacyModel === 'mandatory' ? 'Always Private' :
                         project.privacyModel === 'opt-in' ? 'Opt-in Privacy' : 'No Privacy'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="bg-[#151515] border border-[#333] rounded-lg p-4">
              <p className="text-[#94e2d5] text-sm">
                <strong>Pattern:</strong> Ethereum privacy tools mostly use zk-SNARKs - the same tech Zcash pioneered.
                Projects like Semaphore and Tornado Cash share cryptographic roots. The difference is in what they protect:
                Tornado hides transaction amounts, Semaphore hides identities.
              </p>
            </div>
          </section>
        )}

        {/* Section: Privacy Coins */}
        {activeSection === 'coins' && (
          <section className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Monero Ecosystem */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#f9e2af] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#f9e2af]"></span>
                  CryptoNote Family (Ring Signatures)
                </h3>
                <div className="bg-[#1a1a1a] border border-[#f9e2af]/30 rounded-lg p-4">
                  <Link href="/projects/monero" className="block hover:text-[#94e2d5]">
                    <h4 className="font-semibold text-white">Monero (XMR)</h4>
                  </Link>
                  <p className="text-sm text-[#888] mt-2">
                    Privacy is <strong className="text-[#a6e3a1]">mandatory</strong>. Every transaction uses:
                  </p>
                  <ul className="text-sm text-[#888] mt-2 space-y-1">
                    <li>• Ring Signatures - hides sender among decoys</li>
                    <li>• Stealth Addresses - one-time receiver addresses</li>
                    <li>• RingCT - hides transaction amounts</li>
                    <li>• Bulletproofs+ - efficient range proofs</li>
                  </ul>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-full bg-[#333] h-2 rounded">
                      <div className="bg-[#a6e3a1] h-2 rounded" style={{ width: '95%' }}></div>
                    </div>
                    <span className="text-[#a6e3a1] text-sm font-bold">95</span>
                  </div>
                </div>
                <div className="text-xs text-[#666] pl-4 border-l-2 border-[#f9e2af]/30">
                  Related: Oxen, Zano (same CryptoNote lineage, shared contributors)
                </div>
              </div>

              {/* Zcash Ecosystem */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#94e2d5] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#94e2d5]"></span>
                  zk-SNARK Family (Zero Knowledge)
                </h3>
                <div className="bg-[#1a1a1a] border border-[#94e2d5]/30 rounded-lg p-4">
                  <Link href="/projects/zcash" className="block hover:text-[#94e2d5]">
                    <h4 className="font-semibold text-white">Zcash (ZEC)</h4>
                  </Link>
                  <p className="text-sm text-[#888] mt-2">
                    Privacy is <strong className="text-[#f9e2af]">opt-in</strong>. Shielded transactions use:
                  </p>
                  <ul className="text-sm text-[#888] mt-2 space-y-1">
                    <li>• zk-SNARKs - cryptographic proofs</li>
                    <li>• Sapling/Orchard shielded pools</li>
                    <li>• Halo2 - no trusted setup (Orchard)</li>
                    <li>• View keys - selective disclosure</li>
                  </ul>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-full bg-[#333] h-2 rounded">
                      <div className="bg-[#f9e2af] h-2 rounded" style={{ width: '80%' }}></div>
                    </div>
                    <span className="text-[#f9e2af] text-sm font-bold">80</span>
                  </div>
                </div>
                <div className="text-xs text-[#666] pl-4 border-l-2 border-[#94e2d5]/30">
                  Tech shared with: Tornado Cash, Semaphore, zkSync, Iron Fish
                </div>
              </div>
            </div>

            <div className="bg-[#151515] border border-[#333] rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Mandatory vs Opt-in Privacy</h4>
              <p className="text-sm text-[#888]">
                Monero's <span className="text-[#a6e3a1]">mandatory privacy</span> means everyone looks the same -
                large anonymity set. Zcash's <span className="text-[#f9e2af]">opt-in privacy</span> means shielded
                users stand out - smaller anonymity set. Both approaches have tradeoffs around regulatory
                acceptance and practical privacy.
              </p>
            </div>
          </section>
        )}

        {/* Section: Bridges */}
        {activeSection === 'bridges' && (
          <section className="space-y-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-[#a6adc8]">
                Privacy technologies don't exist in isolation. Cryptographic innovations flow between ecosystems,
                and some projects explicitly bridge different privacy approaches.
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-[#252525] rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Technology Bridges</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-[#0f0f0f] rounded-lg">
                  <div className="flex-1">
                    <span className="text-[#94e2d5]">Zcash zk-SNARKs</span>
                  </div>
                  <div className="text-[#666]">&rarr;</div>
                  <div className="flex-1 text-center">
                    <span className="text-[#f9e2af]">Groth16 proving system</span>
                  </div>
                  <div className="text-[#666]">&rarr;</div>
                  <div className="flex-1 text-right">
                    <span className="text-[#89b4fa]">Ethereum rollups, Tornado Cash</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[#0f0f0f] rounded-lg">
                  <div className="flex-1">
                    <span className="text-[#f9e2af]">Monero RingCT</span>
                  </div>
                  <div className="text-[#666]">&rarr;</div>
                  <div className="flex-1 text-center">
                    <span className="text-[#a6e3a1]">Bulletproofs</span>
                  </div>
                  <div className="text-[#666]">&rarr;</div>
                  <div className="flex-1 text-right">
                    <span className="text-[#cba6f7]">MobileCoin, Findora</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[#0f0f0f] rounded-lg">
                  <div className="flex-1">
                    <span className="text-[#fab387]">Signal Protocol</span>
                  </div>
                  <div className="text-[#666]">&rarr;</div>
                  <div className="flex-1 text-center">
                    <span className="text-[#94e2d5]">Double Ratchet</span>
                  </div>
                  <div className="text-[#666]">&rarr;</div>
                  <div className="flex-1 text-right">
                    <span className="text-[#f5c2e7]">Session, Element (Matrix)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#151515] border border-[#333] rounded-lg p-4">
                <h4 className="font-semibold text-[#94e2d5] mb-2">Shared Contributors</h4>
                <p className="text-sm text-[#888]">
                  Developers often work across multiple privacy projects. The Monero-Oxen ecosystem shares
                  7+ core contributors. The iden3/Semaphore/SnarkJS ecosystem shares ZK expertise.
                </p>
              </div>

              <div className="bg-[#151515] border border-[#333] rounded-lg p-4">
                <h4 className="font-semibold text-[#f9e2af] mb-2">Cross-Chain Privacy</h4>
                <p className="text-sm text-[#888]">
                  Projects like Webb Protocol enable private cross-chain transfers. Atomic swaps between
                  Monero and Bitcoin preserve some privacy. These bridges are experimental but growing.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="border-t border-[#252525] pt-8 mt-12">
          <div className="bg-gradient-to-r from-[#1a1a1a] to-[#151515] border border-[#252525] rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Explore the Full Graph</h3>
            <p className="text-[#888] mb-4">
              See all 48 privacy projects and their technology connections in our interactive visualization.
            </p>
            <Link
              href="/ecosystem"
              className="inline-block px-6 py-3 bg-[#94e2d5] text-[#1a1a1a] rounded-lg font-medium hover:bg-[#a6e3a1] transition-colors"
            >
              Open Privacy Tech Graph
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
