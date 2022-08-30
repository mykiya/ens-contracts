const { keccak256 } = require('js-sha3');
const namehash = require('eth-ens-namehash')

module.exports = async ({
  getNamedAccounts,
  deployments,
  network,
}) => {
  const { deploy } = deployments;
  const { deployer, owner } = await getNamedAccounts();

  if (!network.tags.use_root) {
    return true
  }

  const registry = await ethers.getContract('ENSRegistry')
  const root = await ethers.getContract('Root')

  await deploy('BaseRegistrarImplementation', {
    from: deployer,
    args: [registry.address, namehash.hash('eth')],
    log: true,
  })

  const registrar = await ethers.getContract('BaseRegistrarImplementation')

  const tx1 = await registrar.addController(owner, { from: deployer })
  console.log(`Adding owner as controller to registrar (tx: ${tx1.hash})...`)
  await tx1.wait()

  const tx2 = await root
    .connect(await ethers.getSigner(owner))
    .setSubnodeOwner('0x' + keccak256('eth'), registrar.address)
  console.log(
    `Setting owner of eth node to registrar on root (tx: ${tx2.hash})...`,
  )
  await tx2.wait()
};

module.exports.tags = ['BaseRegistrarImplementation']
module.exports.dependencies = ['ENSRegistry', 'Root']
