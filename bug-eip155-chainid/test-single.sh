#!/usr/bin/env bash

startingVersion=$1
starting155Block=$2
head=$3
startingCID=$4
ending155Block=$5
endingCID=$6
expectedExitCode=$7

cd /Users/peter/IdeaProjects/quorum-ex/examples/7nodes/

echo "Stopping previous runs"
bash stop.sh

echo "Using version of geth at ${startingVersion}"
cp ${startingVersion} /usr/local/bin/geth

echo "Writing genesis with EIP155 ${starting155Block} and ChainID ${startingCID}"
bash /Users/peter/IdeaProjects/web3tests/bug-eip155-chainid/create-nil-genesis.sh "${starting155Block}" "${startingCID}"

echo "Initing Istanbul"
bash istanbul-init.sh

echo "Starting Istanbul"
bash istanbul-start.sh

echo "Waiting for block number ${head}"
node /Users/peter/IdeaProjects/web3tests/bug-eip155-chainid/run-to-blockNum.js ${head}

echo "Stopping..."
bash stop.sh

echo "Copying new version in"
cp ~/GETH_NEW /usr/local/bin/geth

echo "Writing genesis with EIP155 ${ending155Block} and ChainID ${endingCID}"
bash /Users/peter/IdeaProjects/web3tests/bug-eip155-chainid/create-genesis.sh "${ending155Block}" "${endingCID}"

echo "Trying to reinit node 1"
geth --datadir qdata/dd1 init istanbul-genesis.json

exitCode=$?
echo "Reinit gave exit code ${exitCode}, wanted ${expectedExitCode}"

exit $([ "${exitCode}" == "${expectedExitCode}" ])