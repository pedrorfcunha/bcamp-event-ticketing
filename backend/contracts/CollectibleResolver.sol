// SPDX-License-Identifier: None

pragma solidity ^0.8.9;

import "@ethereum-attestation-service/eas-contracts/contracts/resolver/SchemaResolver.sol";
import "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import "./IEventCollectible.sol";

contract CollectibleResolver is SchemaResolver {
    IEventCollectible private _nftContract;

    mapping(bytes32 => uint256) private _attestationTokenIds;

    constructor(IEAS eas, address nftContractAddress) SchemaResolver(eas) {
        _nftContract = IEventCollectible(nftContractAddress);
    }

    function onAttest(
        Attestation calldata attestation,
        uint256 value
    ) internal override returns (bool) {
        require(value == 0, "Value should be zero");

        uint256 eventId;
        string memory name;
        string memory location;
        uint256 date;
        address userAddr;
        uint256 userId;

        (eventId, name, location, date, userAddr, userId) = abi.decode(
            attestation.data,
            (uint256, string, string, uint256, address, uint256)
        );

        _nftContract.mint(
            userAddr,
            IEventCollectible.EventData({
                eventId: eventId,
                name: name,
                location: location,
                date: date,
                userAddr: userAddr,
                userId: userId
            })
        );

        _attestationTokenIds[attestation.uid] = _nftContract.tokenIdCounter();

        return true;
    }

    function onRevoke(
        Attestation calldata attestation,
        uint256 value
    ) internal override returns (bool) {
        require(value == 0, "Value should be zero");

        uint256 tokenId = _attestationTokenIds[attestation.uid];
        require(tokenId != 0, "Token ID not found for this attestation");

        _nftContract.burn(tokenId);

        delete _attestationTokenIds[attestation.uid];

        return true;
    }
}
