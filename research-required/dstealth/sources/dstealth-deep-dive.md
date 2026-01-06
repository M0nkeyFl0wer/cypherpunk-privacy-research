# Stealth (XST) Deep Dive

This document provides a deep dive into the Stealth (XST) protocol, covering its consensus mechanism, signing algorithm, privacy features, and governance model.

## README.md Content

```
= Stealth [XST]

Stealth is a fast, feelesss, private, and scalable blockchain built on the Junaeth cryptocurrency protocol.
Stealth consensus is achieved through a novel protocol wherein validators, called "StealthNodes", are permanently bonded.
In other words, creating a StealthNode requires a one-way burn of XST, the functional currency of the Stealth blockchain.
Because StealthNodes are permanently bonded with irrevocable blockchain rights, StealthNode owners are beholden to no one, acting entirely independently and fully in the interests of their StealthNode assets.
StealthNodes are transferrable, and their value is tied objectively to their performance.

Because of Stealth's unique and efficient consensus protocol, it can offer feeless transactions, global scalability, and unparalleled spam resistance, without expensive proof-of-work (PoW) or any subservience to privileged stakeholders, like founders and other insiders.

Stealth also has a number of other unique technological advancements, including a distributed network clock that promotes regular blocktimes and therefore regular, 5 second feeless transaction confirmations.
Another advancement is temporally-bound memory-hard work for feeless transactions.
Temporal binding allows feeless transactions to expire, making sustained denial-of-service (DoS) prohibitively expensive.
Transaction expiration also allows for a quick (2 minute), no-fee resolution in the exceedingly rare event that a feeless transaction becomes stuck without confirmation.
No other cryptocurrency offers quick, feeless resolution to stuck transactions, which happen with every payment system.

== Money supply

* Algorithm: X13
* Premine: 1% (232,740 XST), max value less than $10,000 (2014)
* First 10 Blocks: Premine 23,274 XST Each
* Next 250 Blocks: 16.0 XST each (4 hr low reward for fair launch)
* Block 261 Award: 8,000 XST
* Halving every 1440 blocks (about 1 day)
* Last PoW block: 20,420
* Total PoW Money: 23,273,860 XST
* Yearly Inflation: 1.01%

== Ports

* P2P: `4437`
* Testnet P2P: `4438`
* RPC: `46502`
* Testnet RPC: `46503`

== Application

* Daemon Name: `StealthCoind`
* Conf File (Case Sensitive): `StealthCoin.conf`
* Addresses: Usually start with "S"
* Testnet Addresses: Usually start with "m"

== Application Directories

* Windows < Vista: `C:\Documents and Settings\Username\Application Data\StealthCoin`
* Windows >= Vista: `C:\Users\Username\AppData\Roaming\StealthCoin`
* Mac: `~/Library/Application Support/StealthCoin`, `~/.StealthCoin`
* Unix: `~/.StealthCoin`
```

## Junaeth Proof-of-Merit Consensus Mechanism

Junaeth is the consensus protocol for the Stealth (XST) blockchain. It is a bespoke system that combines features of Proof-of-Stake and a reputation system, which the project refers to as "Proof-of-Merit".

### Key Features

- **Reputation System:** Validators (StealthNodes) earn a reputation score, or "weight", based on their performance in validating blocks. This weight increases with the number of blocks validated and decreases with missed blocks. Higher weight leads to increased rewards and influence on the network.
- **Scheduled Block Validation:** StealthNodes are assigned specific slots in a schedule for block validation, which contributes to the network's efficiency and fast 5-second block times.
- **Economic Incentives:** Validation rights are tokenized as "StealthNodes," which are purchased by burning XST. This economic incentive is designed to ensure that validators are invested in the long-term success of the network.
- **Feeless Transactions:** The protocol supports feeless transactions, where the sender performs a small amount of proof-of-work instead of paying a fee.

### Tech Stack Analysis

- **Primary Language:** C++. This is inferred from the file extensions in the repository and the daemon name `StealthCoind`.
- **Consensus Logic:** The consensus logic is implemented in C++ within the core of the StealthCoin client.

## Quantum Proof-of-Stake (qPoS) Signing Algorithm

Quantum Proof-of-Stake (qPoS) is the signing algorithm used in the Stealth (XST) protocol. It is an economic-driven, round-robin block certification system where block rewards are based on performance.

### Key Features

- **Economic-Driven Consensus:** qPoS relies on economic incentives to secure the network. Validators, known as "StealthNodes" or "stakers", purchase the right to process transactions and are rewarded for their performance.
- **Round-Robin Block Certification:** Validators are placed in a queue and take turns certifying blocks in a round-robin fashion. This contributes to the network's fast 5-second block times.
- **Performance-Based Rewards:** Block rewards are based on the performance of the validator. This incentivizes validators to be reliable and performant.

## zk-SNARKs Integration for Private Transactions

Stealth (XST) plans to implement private transactions using a sidechain called **StealthPrivate** and zk-SNARKs. This feature is currently under development.

### Key Features

- **Sidechain Architecture:** Private transactions will occur on a dedicated sidechain called StealthPrivate. This keeps private transactions separate from the main chain (StealthCore).
- **Private Coins:** Users will be able to transfer XST from StealthCore to StealthPrivate, where it can be converted into a private coin called XSS StealthSend.
- **Two-Way Peg:** A two-way peg mechanism will allow for the transfer of assets between StealthCore and StealthPrivate.
- **zk-SNARKs for Privacy:** zk-SNARKs will be used to conceal the sender, receiver, and amount of transactions on the StealthPrivate sidechain.

## On-Chain Governance Model

Stealth (XST) employs an on-chain governance model that is deeply integrated with its Junaeth consensus mechanism. The model is designed to be economically driven and decentralized.

### Key Features

- **Economic-Driven Governance:** The governance model is based on economic incentives. Validators, known as "StealthNodes", acquire their rights to participate in governance by purchasing them with XST.
- **StealthNodes as NFTs:** StealthNodes are tokenized as non-fungible tokens (NFTs), which grant their owners the right to validate blocks and participate in governance.
- **Decentralization:** By having validation rights be purchasable assets, the model aims to avoid centralization and control by a single entity or group of insiders.
- **Performance-Based Rewards:** The system rewards validators based on their performance, which is measured by a reputation score or "staker weight".

## GitHub Repo

- **Repository:** [https://github.com/StealthSend/StealthCoin](https://github.com/StealthSend/StealthCoin)

## Website

- **Official Website:** [https://stealth.org/](https://stealth.org/)

## Research Gaps

- **Source Code Access:** Direct access to and analysis of the source code was not possible, limiting the depth of the tech stack analysis.
- **Official Diagrams:** The lack of official architectural diagrams for the consensus mechanism, signing algorithm, and governance model makes it difficult to visualize their workings.