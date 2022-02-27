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

    contract = UANFT.at("0xd084B091bAf94154D782f78EB9f904A76d8F741a")
    contract.setRecipient("0x0D6d4D79EA05925da11E3D08820E085e228Ae615", {'from': acct})
