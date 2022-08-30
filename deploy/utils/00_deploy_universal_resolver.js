const ZERO_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

module.exports = async ({
  getNamedAccounts,
  deployments,
}) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const registry = await ethers.getContract('ENSRegistry')

  await deploy('UniversalResolver', {
    from: deployer,
    args: [registry.address],
    log: true,
  })
};

module.exports.tags = ['UniversalResolver']
module.exports.dependencies = ['ENSRegistry']
