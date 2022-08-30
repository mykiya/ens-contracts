module.exports = async ({
  getNamedAccounts,
  deployments,
}) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const registry = await ethers.getContract('ENSRegistry')
  const registrar = await ethers.getContract('BaseRegistrarImplementation')
  const metadata = await ethers.getContract('StaticMetadataService')

  const nameWrapper = await deploy('NameWrapper', {
    from: deployer,
    args: [registry.address, registrar.address, metadata.address],
    log: true,
  })

  const tx = await registrar.addController(nameWrapper.address, {
    from: deployer,
  })
  console.log(
    `Adding NameWrapper as controller on registrar (tx: ${tx.hash})...`,
  )
  await tx.wait()
};

module.exports.tags = ['NameWrapper']
module.exports.dependencies = ['BaseRegistrarImplementation', 'ENSRegistry', 'StaticMetadataService']
