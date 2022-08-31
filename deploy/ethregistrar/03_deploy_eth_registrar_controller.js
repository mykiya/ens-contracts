module.exports = async ({
  getNamedAccounts,
  deployments,
}) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const registrar = await ethers.getContract('BaseRegistrarImplementation')
  const priceOracle = await ethers.getContract('StablePriceOracle')

  const controller = await deploy('ETHRegistrarController', {
    from: deployer,
    args: [
      registrar.address,
      priceOracle.address,
      60,
      86400,
    ],
    log: true,
  })

  const tx1 = await registrar.addController(controller.address, {
    from: deployer,
  })
  console.log(
    `Adding controller as controller on registrar (tx: ${tx1.hash})...`,
  )
  await tx1.wait()
};

module.exports.tags = ['ETHRegistrarController']
module.exports.dependencies = ['BaseRegistrarImplementation', 'StablePriceOracle']
