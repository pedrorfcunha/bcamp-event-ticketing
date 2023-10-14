import '@nomicfoundation/hardhat-ethers';
import hre from 'hardhat';
import { EventCollectible } from '../typechain-types';

async function main() {
  const EventCollectible = await hre.ethers.getContractFactory('EventCollectible');

  const ec = (await EventCollectible.deploy()) as EventCollectible;

  await ec.waitForDeployment();

  const ecAddress = await ec.getAddress();

  console.log('ToDoList contract deployed to:', ecAddress);

  const verify = async (contractAddress: string, args: any[]) => {
    console.log('Verifying contract...');
    try {
      await hre.run('verify:verify', {
        address: contractAddress,
        constructorArguments: args,
      });
    } catch (e: any) {
      if (e.message.toLowerCase().includes('already verified')) {
        console.log('Already Verified!');
      } else {
        console.log(e);
      }
    }
  };

  if (hre.network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log('Waiting for block confirmations...');
    await ec.deploymentTransaction()?.wait(6);
    await verify(ecAddress, []);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
