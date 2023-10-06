// SPDX-License-Identifier: None

pragma solidity ^0.8.9;

import "@ethereum-attestation-service/contracts/resolver/SchamaResolver.sol";
import "@ethereum-attestation-service/contracts/IEAS.sol";
import {EventCollectible} from "./EventCollectible.sol";

contract CollectibleResolver is SchemaResolver {
    EventCollectible private _nftContract;

    mapping(bytes32 => uint256) private _attestationTokenIds;

    constructor(IEAS eas, address nftContractAddress) SchemaResolver(eas) {
        _nftContract = EventCollectible(nftContractAddress);
    }

    function onAttest(
        Attestation calldata attestation,
        uint256 value
    ) internal override returns (bool) {
        require(value == 0, "Value should be zero");

        _nftContract.mint(attestation.attester, "");

        _attestationTokenIds[attestation.id] = _nftContract.tokenIdCounter();

        return true;
    }

    function onRevoke(
        Attestation calldata attestation,
        uint256 value
    ) internal override returns (bool) {
        require(value == 0, "Value should be zero");

        uint256 tokenId = _attestationTokenIds[attestation.id];
        require(tokenId != 0, "Token ID not found for this attestation");

        _nftContract.burn(tokenId);

        delete _attestationTokenIds[attestation.id];

        return true;
    }
}
