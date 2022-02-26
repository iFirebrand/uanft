import pytest

from brownie import UANFT, accounts, Wei


@pytest.fixture()
def owner():
    return accounts[0]

@pytest.fixture()
def contract(owner):
    return owner.deploy(UANFT)


def test_happy_path(owner, contract):
    uri = "ipfs://sdafdsafdsfsdafdsafdsa"
    contract.createToken(1, Wei("0.01 ether"), uri, {'from': owner})
    contract.setRecipient(accounts[9])
    assert contract.uri(1) == uri

    contract.publicMint(1, 1, {'from': accounts[1], 'value': Wei("0.01 ether")})
    contract.publicMint(1, 1, {'from': accounts[1], 'value': Wei("0.01 ether")})
