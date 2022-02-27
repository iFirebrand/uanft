import json
import os
from brownie import UANFT, accounts, network


def main():

    network_id = network.show_active()
    if network_id not in {"rinkeby", "mainnet"}:
        raise Exception(f"Unsupported network {network_id}")

  
    # see brownie docs on how to setup a local account with the id `deployment_account`
    acct = accounts.load("uanft_deployer")

    from brownie.network import priority_fee

    priority_fee("2 gwei")

    
    uanft = UANFT.deploy({"from": acct})
    