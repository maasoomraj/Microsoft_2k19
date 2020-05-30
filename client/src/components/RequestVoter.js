import React, { Component } from "react";
import MasoomContract from "../contracts/MasoomContract.json";
import getWeb3 from "../getWeb3";

import { FormGroup, FormControl,Button } from 'react-bootstrap';

class RequestVoter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      MasoomInstance: undefined,
      account: null,
      web3: null,
      name:'',
      aadhar:'',
      constituency:'',
      candidates: null,
      owner:'',
      registered: false
    }
  }

  updateName = event => {
    this.setState({ name : event.target.value});
  }

  updateAadhar = event => {
    this.setState({aadhar : event.target.value});
  }

  updateConstituency = event => {
    this.setState({constituency : event.target.value});
  }

  addVoter = async () => {
    console.log("name - " + this.state.name);
    console.log("aadhar - " + this.state.aadhar);
    console.log("constituency - " + this.state.constituency);
    await this.state.MasoomInstance.methods.requestVoter(this.state.name, this.state.aadhar, this.state.constituency).send({from : this.state.account , gas: 1000000});
  }

  // getCandidates = async () => {
  //   let result = await this.state.MasoomInstance.methods.getCandidates().call();

  //   this.setState({ candidates : result });
  //   console.log(this.state.candidates);
  //   for(let i =0; i <result.length ; i++)
  //   console.log("From contract - " + result[i].name + " " + result[i].voteCount);

  //   console.log(result);
    
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

      let registered;
      for(let i=0;i<voterCount;i++){
          let voterAddress = await this.state.MasoomInstance.methods.voters(i).call();
          if(voterAddress === this.state.account){
            registered = true;
            break;
          }
      }

      this.setState({ registered : registered});

      // const _owner = await this.state.MasoomInstance.methods.owner(0);
      // this.setState({owner : _owner});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    if(this.state.registered){
      return(
        <div>
          ALREADY REQUESTED TO REGISTER
        </div>
      );
    }
    return (
      <div className="App">
        {/* <div>{this.state.owner}</div> */}
        {/* <p>Account address - {this.state.account}</p> */}
        <h2>Add Voter</h2>

        <FormGroup>
          <div>
            <p>Enter Name - </p>
            <FormControl
                input = 'text'
                value = {this.state.name}
                onChange={this.updateName}
            />
          </div>
        </FormGroup>

        <FormGroup>
          <div>
            <p>Enter Aadhar Number - </p>
            <FormControl
                input = 'textArea'
                value = {this.state.aadhar}
                onChange={this.updateAadhar}
            />
          </div>
        </FormGroup>

        <FormGroup>
          <div>
            <p>Enter Constituency - </p>
            <FormControl
                input = 'text'
                value = {this.state.constituency}
                onChange={this.updateConstituency}
            />
          </div>
        </FormGroup>
        <br></br>
        <Button onClick={this.addVoter}>
          Request to Add Voter
        </Button>
        <br></br>
        <br></br>

        {/* <Button onClick={this.getCandidates}>
          Get Name
        </Button> */}


      </div>
    );
  }
}

export default RequestVoter;
