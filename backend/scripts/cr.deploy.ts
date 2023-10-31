import '@nomicfoundation/hardhat-ethers';
import hre from 'hardhat';
import { CollectibleResolver } from '../typechain-types';

async function main() {
  const CollectibleResolver = await hre.ethers.getContractFactory('CollectibleResolver');

  const cr = (await CollectibleResolver.deploy(
    '0xC2679fBD37d54388Ce493F1DB75320D236e1815e',
    '0x6aE20dF8c40D001DeE3503ea320bed917464Fa3b',
  )) as CollectibleResolver;

  await cr.waitForDeployment();

  const ecAddress = await cr.getAddress();

  console.log('CollectibleResolver contract deployed to:', ecAddress);

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
    await cr.deploymentTransaction()?.wait(6);
    await verify(ecAddress, [
      '0xC2679fBD37d54388Ce493F1DB75320D236e1815e',
      '0x6aE20dF8c40D001DeE3503ea320bed917464Fa3b',
    ]);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
