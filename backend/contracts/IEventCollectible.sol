// SPDX-License-Identifier: None
pragma solidity ^0.8.9;

interface IEventCollectible {
    struct EventData {
        uint256 eventId;
        string name;
        string location;
        uint256 date;
        address userAddr;
        uint256 userId;
    }

    event CollectibleMinted(
        uint256 tokenId,
        uint256 eventId,
        string name,
        string location,
        uint256 date,
        address userAddr,
        uint256 userId
    );

    event CollectibleBurned(uint256 tokenId);

    function mint(address recipient, EventData memory data) external;

    function burn(uint256 tokenId) external;

    function getTokenData(
        uint256 tokenId
    ) external view returns (EventData memory);

    function tokenIdCounter() external view returns (uint256);

    function assignMintRole(address _addr) external;

    function assignBurnRole(address _addr) external;
}
