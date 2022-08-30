const { keccak256 } = require('js-sha3');
const namehash = require('eth-ens-namehash');

module.exports = async ({
  getNamedAccounts,
  deployments,
}) => {
  const { deploy } = deployments;
  const { deployer, owner } = await getNamedAccounts();

  const registry = await ethers.getContract('ENSRegistry')
  const publicResolver = await ethers.getContract('PublicResolver');

  const reverseRegistrar = await deploy('ReverseRegistrar', {
    from: deployer,
    args: [registry.address, publicResolver.address],
    log: true,
  })

  const root = await ethers.getContract('Root')

  const tx1 = await root
    .connect(await ethers.getSigner(owner))
    .setSubnodeOwner('0x' + keccak256('reverse'), owner)
  console.log(`Setting owner of .reverse to owner on root (tx: ${tx1.hash})...`)
  await tx1.wait()

  const tx2 = await registry
    .connect(await ethers.getSigner(owner))
    .setSubnodeOwner(
      namehash.hash('reverse'),
      '0x' + keccak256('addr'),
      reverseRegistrar.address,
    )
  console.log(
    `Setting owner of .addr.reverse to ReverseRegistrar on registry (tx: ${tx2.hash})...`,
  )
  await tx2.wait()
};

module.exports.tags = ['ReverseRegistrar']
module.exports.dependencies = ['ENSRegistry', 'PublicResolver', 'Root']
