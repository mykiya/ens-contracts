module.exports = async ({
  getNamedAccounts,
  deployments,
}) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const registry = await ethers.getContract('ENSRegistry')

  if (!network.tags.legacy) {
    return
  }

  await deploy('LegacyPublicResolver', {
    from: deployer,
    args: [registry.address],
    log: true,
    contract: await deployments.getArtifact('PublicResolver_mainnet_9412610'),
  })
};

module.exports.tags = ['LegacyPublicResolver']
module.exports.dependencies = ['ENSRegistry']
