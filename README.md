# Validator Resource Center for Kusama (Phase 2)

The Validator Resource Center for Kusama aims to provide quantitative and qualitative data about validators performance and help nominators to choose their best nomination set.

Phase 2 of the Validator Resource Center and Ranking Website (VRC) further improves upon the ranking method from Phase 1, by making the scoring model more customizable and thereby better representing the user’s preferences. Also, the VRC score is now a major metric in the manual selection process. Additionally, we include several new metrics (e.g. performance based on historic era data) and thereby reduce the load of information on nominators. A new filtering technique helps to reduce the overall set of validators based on their quantitative properties and make it easier for nominators to make an appropriate selection.

Aside from that, Phase 2 introduces a staking dashboard, which gives important visual and numerical information about the network, allowing comparisons of sets to the state of the network. It will be even possible to import your current nominations (via the polkadot.js extension) and check whether some critical events happened to nominated validators (e.g., an increase of commission or a slash).

## Project status

- Milestone 1: Completed
- Milestone 2: In progress

## Install

Install mono-repo:

```
git clone https://github.com/Colm3na/kusama-validator-resource-center-v2.git
cd kusama-validator-resource-center-v2
yarn
```

### Frontend

You will need `nodejs`:

```
yarn workspace frontend dev
```

That will start a dev frontend with hot reload. 

### Backend

You will need `nodejs`, `docker` and `docker-compose`:

```
yarn workspace backend docker
```

That will build and start all the required dockers automagically:

- PostgreSQL
- Hasura GraphQL server
- Parity Polkadot client
- Nodejs crawler

## Project funded by Kusama Treasury

The development of this project is being funded by Kusama Treasury, you can review the full proposal [here](https://docs.google.com/document/d/14pvmbMMzNAqVzQkoXi_nRS-1wDti2y03X4VqOp9nNTw).

A link to the last proposal for Phase I can be found [here](https://kusama.polkassembly.io/motion/217).

Previous discussion about this proposal can be found [here](https://kusama.polkassembly.io/post/427).

Please leave your comments!

## Code of conduct for the implementation

We are aware that this project bears a large responsibility towards nominators and validators. Therefore, every decision on this implementation follows these principles as much as possible:

- Act in the interest of the network as much as possible.
- Act in the interest of the nominator whenever possible.
- Objectivity on validators selection as much as possible. Don't discriminate against individual validators.
- We value user preferences and try to give them as much freedom as possible while maintaining the trade-off with usability.
- You can review the full proposal here. Please leave your comments!


