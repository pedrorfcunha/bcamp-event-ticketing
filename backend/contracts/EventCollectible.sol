// SPDX-License-Identifier: None
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IEventCollectible.sol";

contract EventCollectible is IEventCollectible, ERC721, AccessControl {
    bytes32 public constant MINT_ROLE = keccak256("MINT_ROLE");
    bytes32 public constant BURN_ROLE = keccak256("BURN_ROLE");

    uint256 private _tokenIdCounter;

    mapping(uint256 => EventData) private _tokenData;

    constructor() ERC721("EventNFT", "ENFT") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINT_ROLE, msg.sender);
        _setupRole(BURN_ROLE, msg.sender);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function mint(
        address recipient,
        EventData memory data
    ) external onlyRole(MINT_ROLE) {
        uint256 newTokenId = incrementTokenId();

        _safeMint(recipient, newTokenId);
        _setTokenData(newTokenId, data);

        emit CollectibleMinted(
            newTokenId,
            data.eventId,
            data.name,
            data.location,
            data.date,
            data.userAddr,
            data.userId
        );
    }

    function burn(uint256 tokenId) external onlyRole(BURN_ROLE) {
        _burn(tokenId);
        delete _tokenData[tokenId];
        emit CollectibleBurned(tokenId);
    }

    function getTokenData(
        uint256 tokenId
    ) external view returns (EventData memory) {
        return _tokenData[tokenId];
    }

    function _setTokenData(uint256 tokenId, EventData memory data) internal {
        _tokenData[tokenId] = data;
    }

    function incrementTokenId() internal returns (uint256) {
        _tokenIdCounter = _tokenIdCounter + 1;
        return tokenIdCounter();
    }

    function tokenIdCounter() public view returns (uint256) {
        return _tokenIdCounter;
    }

    function assignMintRole(address _addr) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MINT_ROLE, _addr);
    }

    function assignBurnRole(address _addr) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(BURN_ROLE, _addr);
    }
}
