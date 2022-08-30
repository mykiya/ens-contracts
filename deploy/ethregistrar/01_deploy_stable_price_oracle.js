module.exports = async ({
  getNamedAccounts,
  deployments,
}) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  if (network.name === 'mainnet') {
    return true
  }

  const dummyOracle = await deploy('DummyOracle', {
    from: deployer,
    args: ['100000000'],
    log: true,
  })

  await deploy('StablePriceOracle', {
    from: deployer,
    args: [dummyOracle.address, [0, 0, 4, 2, 1]],
    log: true,
  })
};

module.exports.tags = ['StablePriceOracle']
module.exports.dependencies = []
