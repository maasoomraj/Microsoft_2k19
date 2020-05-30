// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.17;
// pragma experimental ABIEncoderV2;

contract MasoomContract {

    address public owner;
    uint candidateCount;

    uint voterCount;

    // Constructor
    function MasoomContract() public {
        owner = msg.sender;
        candidateCount = 0;
        voterCount = 0;
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    // Only Admin can access
    modifier onlyAdmin() {
        require(msg.sender == owner);
        _;
    }

    struct Candidate{
        string name;
        string party;
        string manifesto;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidateDetails;

    // Only admin can add candidate
    function addCandidate(string _name, string _party, string _manifesto) public onlyAdmin {
        Candidate memory newCandidate = Candidate({
           name : _name,
           party : _party,
           manifesto : _manifesto,
           voteCount : 0
        });

        candidateDetails[candidateCount] = newCandidate;
        candidateCount += 1;
    }

    // get total number of candidates
    function getCandidateNumber() public view returns (uint) {
        return candidateCount;
    }

    struct Voter{
        address voterAddress;
        string name;
        string aadhar;
        string constituency;
        bool hasVoted;
        bool isVerified;
    }

    address[] public voters;
    mapping(address => Voter) public voterDetails;

    // request to be added as voter
    function requestVoter(string _name, string _aadhar, string _constituency) public {
        Voter memory newVoter = Voter({ 
           voterAddress : msg.sender,
           name : _name,
           aadhar : _aadhar,
           constituency : _constituency,
           hasVoted : false,
           isVerified : false
        });

        voterDetails[msg.sender] = newVoter;
        voters.push(msg.sender);
        voterCount += 1;
    }

    // get total number of voters
    function getVoterCount() public view returns (uint) {
        return voterCount;
    }

    // function getCandidates() public view returns (Candidate[] memory){
    //     return candidates;
    // }

    // function getCandidates() public view returns (address[]) {
    //     return candidates;
    // }

    // string public name;

    // function setName(string calldata _name) external {
    //     name = _name;
    // }

    // function getName() external view returns (string memory){
    //     return name;
    // }
}