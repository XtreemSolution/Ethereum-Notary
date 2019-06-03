pragma solidity ^0.4.4;


contract Notary {

  struct Record {
      uint mineTime;
      uint blockNumber;
  }

  mapping (bytes32 => Record) private docHashes;

  function Notary() public {
    // constructor
  }

  function addDocHash (bytes32 hash) public {
    Record memory newRecord = Record(now, block.number);
    docHashes[hash] = newRecord;

  }

  function findDocHash (bytes32 hash) public constant returns(uint, uint) {
    return (docHashes[hash].mineTime, docHashes[hash].blockNumber);
  }

}
