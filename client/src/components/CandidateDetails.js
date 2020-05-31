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

        candidateList.push(candidate);
      }


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
        <div className="candidate">
          <div className="candidateName">{candidate.name}</div>
          <div className="candidateDetails">
            <div>Party : {candidate.party}</div>
            <div>Manifesto : {candidate.manifesto}</div>
            <div>Constituency Number : {candidate.constituency}</div>
            <div>Candidate ID : {candidate.candidateId}</div>
          </div>
        </div>
        );
      });
    }
    
    if (!this.state.web3) {
      return (
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
            Loading Web3, accounts, and contract..
            </h1>
          </div>
        </div>
      );
    }
    
    return (
      <div className="CandidateDetails">
        <div className="CandidateDetails-title">
          <h1>
            Candidates List
          </h1>
        </div>
        
        <div className="CandidateDetails-sub-title">
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
