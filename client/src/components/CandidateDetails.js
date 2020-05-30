import React, { Component } from "react";
import MasoomContract from "../contracts/MasoomContract.json";
import getWeb3 from "../getWeb3";

import '../index.css';

class CandidateDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      MasoomInstance: undefined,
      account: null,
      web3: null,
      candidateCount: 0,
      candidateList: null
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

      let candidateCount = await this.state.MasoomInstance.methods.getCandidateNumber().call();
      this.setState({ candidateCount : candidateCount });

      let candidateList = [];
      for(let i=0;i<candidateCount;i++){
        let candidate = await this.state.MasoomInstance.methods.candidateDetails(i).call();
        // console.log("LIST - " + candidate.name);
        candidateList.push(candidate);
      }

      console.log(candidateList);
      this.setState({candidateList : candidateList});

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    let candidateList;
    if(this.state.candidateList){
      candidateList = this.state.candidateList.map((candidate) => {
        return (
        <div className="candidateList">
          <div className="nameList">Name : {candidate.name}</div>
          <div className="partyList">Party : {candidate.party}</div>
          <div className="manifestoList">Manifesto : {candidate.manifesto}</div>
          <div className="voteCountList">Votes : {candidate.voteCount}</div>
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
          Candidates List
        </h1>
        <div className="GetName">
          Total Number of Candidates - {this.state.candidateCount}
        </div>
        <div>
          {candidateList}
        </div>
      </div>
    );
  }
}

export default CandidateDetails;
