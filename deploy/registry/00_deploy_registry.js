const ZERO_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

module.exports = async ({
  getNamedAccounts,
  deployments,
}) => {
  const { deploy, run } = deployments;
  const { deployer, owner } = await getNamedAccounts();

  console.log('starting')

  const contract = await deploy('LegacyENSRegistry', {
    from: deployer,
    args: [],
    log: true,
    contract: await deployments.getArtifact('ENSRegistry'),
  })

  const legacyRegistry = await ethers.getContract('LegacyENSRegistry')

  console.log(`deployer: ${deployer}`)
  console.log(`owner: ${owner}`)
  const rootTx = await legacyRegistry
    .connect(await ethers.getSigner(deployer))
    .setOwner(ZERO_HASH, owner)
  console.log(`Setting owner of root node to owner (tx: ${rootTx.hash})`)
  await rootTx.wait()

  console.log('Running legacy registry scripts...')
  // await run('legacy-registry-names', {
  //   deletePreviousDeployments: false,
  //   resetMemory: false,
  // })

  const revertRootTx = await legacyRegistry
    .connect(await ethers.getSigner(owner))
    .setOwner(ZERO_HASH, '0x0000000000000000000000000000000000000000')
  console.log(`Unsetting owner of root node (tx: ${rootTx.hash})`)
  await revertRootTx.wait()

  await deploy('ENSRegistry', {
    from: deployer,
    args: [contract.address],
    log: true,
    contract: await deployments.getArtifact('ENSRegistryWithFallback'),
  })
};

module.exports.tags = ['ENSRegistry']
