import json
import os
from brownie import UANFT, Wei, accounts, network


def main():
    contract = UANFT.at("0xd084B091bAf94154D782f78EB9f904A76d8F741a")
    UANFT.publish_source(contract)
