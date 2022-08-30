module.exports = async ({
  getNamedAccounts,
  deployments,
}) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  let metadataHost =
    process.env.METADATA_HOST || 'ens-metadata-service.appspot.com'

  if (network.name === 'localhost') {
    metadataHost = 'http://localhost:8080'
  }

  const metadataUrl = `${metadataHost}/name/0x{id}`

  await deploy('StaticMetadataService', {
    from: deployer,
    args: [metadataUrl],
    log: true,
  })
};

module.exports.tags = ['StaticMetadataService']
module.exports.dependencies = []
