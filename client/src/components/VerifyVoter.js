import React, { Component } from "react";
import MasoomContract from "../contracts/MasoomContract.json";
import getWeb3 from "../getWeb3";

import '../index.css';

class VerifyVoter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      MasoomInstance: undefined,
      account: null,
      web3: null,
      votersList: null
    }
  }

  // getCandidates = async () => {
  //   let result = await this.state.MasoomInstance.methods.getCandidates().call();

  //   this.setState({ candidates : result });
  //   for(let i =0; i <result.length ; i++)
  //   console.log("From contract - " + result[i].name + " " + result[i].voteCount);
    
  // }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MasoomContract.networks[networkId];
      const instance = new web3.eth.Contract(
        MasoomContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.

      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.setState({ MasoomInstance: instance, web3: web3, account: accounts[0] });

      let voterCount = await this.state.MasoomInstance.methods.getVoterCount().call();
      console.log("voterCount - " + voterCount);

      let votersList = [];
      for(let i=0;i<voterCount;i++){
          let voterAddress = await this.state.MasoomInstance.methods.voters(i).call();
          console.log("voterAddress - " + voterAddress);
          let voterDetails = await this.state.MasoomInstance.methods.voterDetails(voterAddress).call();
          if(!voterDetails.hasVoted){
              console.log("HAS voted");
          }
          votersList.push(voterDetails);
      }

    //   let voters = [];
    //   voters = await this.state.MasoomInstance.methods.getVoters().call();
    //   this.setState({ voters : voters });

    //   let votersList = [];
    //   for(let i=0;i<voters.length;i++){
    //     let voter = await this.state.MasoomInstance.methods.voterDetails(voters[i]).call();
    //     // console.log("LIST - " + candidate.name);
    //     votersList.push(voter);
    //   }

    //   console.log(votersList);
      this.setState({votersList : votersList});

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    let votersList;
    if(this.state.votersList){
        votersList = this.state.votersList.map((voter) => {
        return (
        <div className="candidateList">
          <div className="nameList">Name : {voter.name}</div>
          <div className="partyList">Aadhar : {voter.aadhar}</div>
          <div className="manifestoList">Constituency : {voter.constituency}</div>
          {/* <div className="voteCountList">hasVoted : {voter.hasVoted}</div>
          <div className="voteCountList">isVerified : {voter.isVerified}</div> */}
          <div className="voteCountList">Voter Address : {voter.voterAddress}</div>
          <br></br>
        </div>
        );
      });
    }
    
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div>
        <h1>
          Voters List
        </h1>
        <div>
          {votersList}
        </div>
      </div>
    );
  }
}

export default VerifyVoter;
