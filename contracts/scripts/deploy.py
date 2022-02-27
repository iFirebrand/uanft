import json
import os
from brownie import UANFT, Wei, accounts, network


def main():

    network_id = network.show_active()
    if network_id not in {"rinkeby", "mainnet"}:
        raise Exception(f"Unsupported network {network_id}")

  
    # see brownie docs on how to setup a local account with the id `deployment_account`
    acct = accounts.load("uanft_deployer")

    from brownie.network import priority_fee

    priority_fee("2 gwei")

    uanft = UANFT.deploy({"from": acct})
    uanft.setRecipient("0xa1b1bbB8070Df2450810b8eB2425D543cfCeF79b", {'from': acct})
    uanft.createToken(1, Wei('0.01 ether'), 'ipfs://QmYahZ8NstfK6oMCFfyhkoLJjVpQ7qYvbNynYw2a4sK8KP', {'from': acct})
    # uanft.transferOwnership()
    