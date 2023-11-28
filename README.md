<h1 align="center">
   BCAMP - Sept/23 Event Ticketing</h1>

---

<h2 align="center">
  Attestations and NFTs: an innovative way to handle event ticketing.
</h2>

---

## Check the Live

Live URL: https://web3ticketing.netlify.app/

## Preview

<img src="/frontend/public/live-url-preview.png">

## Description

This project includes a backend directory with the smart contracts, tests, and deploy scripts and a frontend directory with our React application.

## Architecture - Brief explanation

<img src="/diagram.png">

The core concept of our project revolves around utilizing attestations to construct an event ticketing platform. We're building atop the Ethereum Attestations Service, with our schema representing the data fields of a ticket. This means the event organizer will populate this schema with event details and the buyer's personal information. This attestation will serve as the ticket, and we'll provide a QR code for verification purposes.

In addition to this primary function, we're aiming to develop an NFT smart contract (ERC721) that will integrate seamlessly with an attestation resolver contract. Through this integration, we can automate the minting of NFTs for customers, allowing them to store these as collectibles. This adds an extra layer of value, fostering greater engagement. We're also designing a solution to regulate prices in the secondary market, as we won't allow ticket reselling. Customers will need to return their tickets to the organizer, after which a new ticket may be attested for another customer at a controlled price. To achieve this, we're designating the attestations as revocable and using the resolver contract to burn the collectible NFT when necessary.

Lastly, we're crafting a React application to emulate the end-user experience — a responsive website where users can purchase tickets for specific events

## Getting Started

See the instructions down below at [Installation](#installation)
and [Running / Development](#running-/-development) to get a copy of the
project up and running on your local machine.

#### Technologies

##### Backend:

- Framework: Hardhat
- Solidity
- Typescript
- Chai/Mocha

##### Frontend:

- React
- Typescript
- Tailwind
- React Query

## Installation

- `git clone https://github.com/pedrorfcunha/bcamp-event-ticketing.git` this repository
- `cd chatgpt-hamburguer-generator`
- `cd frontend`
- `npm install` or `yarn install`

## Running / Development

### Env Variables

Create a .env file in the root and add the following:

```
REACT_APP_WALLET_ADDRESS=YOUR_WALLET_ADDRESS
REACT_APP_WALLET_SECRET=YOUR_PRIVATE_KEY
REACT_APP_STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
REACT_APP_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLISHABLE_KEY
REACT_APP_INFURA_API_KEY=YOUR_INFURA_API_KEY
```

- `npm netlify dev` or `yarn netlify dev`
- Visit your app at [http://localhost:8888](http://localhost:8888).
- Note: The private key is used for signing the delegated attestation.

### Payment Data

In order to confirm the payment for the ticket, you should use this payment mock data:
- Card number: 4242 4242 4242 4242
- Expiration (MM/YY): Any date in the future
- CVC: Any 3 (numeric) digits
- Zipcode: Any 5 (numeric) digits
