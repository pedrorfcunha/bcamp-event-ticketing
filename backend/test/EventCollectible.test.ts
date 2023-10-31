import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

import { EventCollectible, IEventCollectible } from '../typechain-types';

describe('Event Collectible NFT Test', function () {
  let ec: EventCollectible;
  let iec: IEventCollectible;

  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async () => {
    const users = await ethers.getSigners();
    [owner, user1, user2] = users;

    const EventCollectible = await ethers.getContractFactory('EventCollectible');
    ec = (await EventCollectible.deploy()) as EventCollectible;
  });

  describe('basic tests', function () {
    it('should have the correct name and symbol', async () => {
      const name = await ec.name();
      const symbol = await ec.symbol();
      expect(name).to.equal('EventNFT');
      expect(symbol).to.equal('ENFT');
    });

    it('The deployer should be able to mint 1 token', async () => {
      const eventData: IEventCollectible.EventDataStruct = {
        eventId: 1,
        name: 'Music Concert',
        location: 'EAS Arena',
        date: Math.floor(Date.now() / 1000),
        userAddr: user1.address,
        userId: 1,
      };
      await ec.connect(owner).mint(user1.address, eventData);

      expect(await ec.balanceOf(user1.address)).to.equal(1);
    });

    it('A random user should not be able to mint 1 token', async () => {
      const eventData: IEventCollectible.EventDataStruct = {
        eventId: 1,
        name: 'Music Concert',
        location: 'EAS Arena',
        date: Math.floor(Date.now() / 1000),
        userAddr: user1.address,
        userId: 1,
      };

      await expect(ec.connect(user1).mint(user1.address, eventData)).to.be.reverted;
    });

    it('The deployer should be able to mint and burn 1 token', async () => {
      const eventData: IEventCollectible.EventDataStruct = {
        eventId: 1,
        name: 'Music Concert',
        location: 'EAS Arena',
        date: Math.floor(Date.now() / 1000),
        userAddr: user1.address,
        userId: 1,
      };
      await ec.connect(owner).mint(user1.address, eventData);
      const tokenId = await ec.connect(owner).tokenIdCounter();
      await ec.connect(owner).burn(tokenId);

      expect(await ec.balanceOf(user1.address)).to.equal(0);
    });

    it('A random user should not be able to burn 1 token', async () => {
      const eventData: IEventCollectible.EventDataStruct = {
        eventId: 1,
        name: 'Music Concert',
        location: 'EAS Arena',
        date: Math.floor(Date.now() / 1000),
        userAddr: user1.address,
        userId: 1,
      };
      await ec.connect(owner).mint(user1.address, eventData);
      const tokenId = await ec.connect(owner).tokenIdCounter();
      await expect(ec.connect(user1).burn(tokenId)).to.be.reverted;
    });

    it('The deployer should be able assing mint and burn roles for other users', async () => {
      const eventData: IEventCollectible.EventDataStruct = {
        eventId: 1,
        name: 'Music Concert',
        location: 'EAS Arena',
        date: Math.floor(Date.now() / 1000),
        userAddr: user1.address,
        userId: 1,
      };
      await ec.connect(owner).assignMintRole(user1.address);
      await ec.connect(owner).assignBurnRole(user1.address);

      await ec.connect(user1).mint(user1.address, eventData);

      expect(await ec.balanceOf(user1.address)).to.equal(1);

      const tokenId = await ec.connect(owner).tokenIdCounter();
      await ec.connect(user1).burn(tokenId);

      expect(await ec.balanceOf(user1.address)).to.equal(0);
    });

    it('The _tokenData mapping should store Event Data by tokenId', async () => {
      const date = Math.floor(Date.now() / 1000);
      const eventData: IEventCollectible.EventDataStruct = {
        eventId: 1,
        name: 'Music Concert',
        location: 'EAS Arena',
        date: date,
        userAddr: user1.address,
        userId: 1,
      };
      await ec.connect(owner).mint(user1.address, eventData);
      const tokenId = await ec.connect(owner).tokenIdCounter();
      const tokenData = await ec.connect(owner).getTokenData(tokenId);

      expect(tokenData.eventId).to.equal(1);
      expect(tokenData.name).to.equal('Music Concert');
      expect(tokenData.location).to.equal('EAS Arena');
      expect(tokenData.date).to.equal(date);
      expect(tokenData.userAddr).to.equal(user1.address);
      expect(tokenData.userId).to.equal(1);
    });
  });
});
