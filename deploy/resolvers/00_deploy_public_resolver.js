module.exports = async ({
  getNamedAccounts,
  deployments,
}) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const registry = await ethers.getContract('ENSRegistry')
  const nameWrapper = await ethers.getContract('NameWrapper')

  await deploy('PublicResolver', {
    from: deployer,
    args: [
      registry.address,
      nameWrapper.address,
    ],
    log: true,
  })
};

module.exports.tags = ['PublicResolver']
module.exports.dependencies = ['ENSRegistry', 'NameWrapper']
