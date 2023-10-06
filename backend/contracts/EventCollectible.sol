// SPDX-License-Identifier: None
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract EventCollectible is ERC721Enumerable {
    uint256 private _tokenIdCounter;

    mapping(uint256 => string) private _tokenData;

    constructor() ERC721("EventNFT", "ENFT") {}

    function mint(address recipient, string memory data) external {
        uint256 newTokenId = incrementTokenId();
        _safeMint(recipient, newTokenId);
        _setTokenData(newTokenId, data);
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner of this token");
        _burn(tokenId);
        delete _tokenData[tokenId];
    }

    function getTokenData(
        uint256 tokenId
    ) external view returns (string memory) {
        return _tokenData[tokenId];
    }

    function _setTokenData(uint256 tokenId, string memory data) internal {
        _tokenData[tokenId] = data;
    }

    function incrementTokenId() internal returns (uint256) {
        _tokenIdCounter = _tokenIdCounter + 1;
        return tokenIdCounter();
    }

    function tokenIdCounter() public view returns (uint256) {
        return _tokenIdCounter;
    }
}
