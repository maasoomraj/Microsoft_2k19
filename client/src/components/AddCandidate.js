import React, { Component } from "react";
import MasoomContract from "../contracts/MasoomContract.json";
import getWeb3 from "../getWeb3";

import { FormGroup, FormControl,Button } from 'react-bootstrap';

class AddCandidate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      MasoomInstance: undefined,
      account: null,
      web3: null,
      name:'',
      party:'',
      manifesto:'',
      candidates: null,
      isOwner:false
    }
  }

  updateName = event => {
    this.setState({ name : event.target.value});
  }

  updateParty = event => {
    this.setState({party : event.target.value});
  }

  updateManifesto = event => {
    this.setState({manifesto : event.target.value});
  }

  addCandidate = async () => {
    console.log("name - " + this.state.name);
    console.log("party - " + this.state.party);
    console.log("manifesto - " + this.state.manifesto);
    await this.state.MasoomInstance.methods.addCandidate(this.state.name, this.state.party, this.state.manifesto).send({from : this.state.account , gas: 1000000});
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

      this.setState({ MasoomInstance: instance, web3: web3, account: accounts[0] });

      console.log("Account - " + this.state.account);
      const owner = await this.state.MasoomInstance.methods.getOwner().call();
      console.log(owner);
      if(this.state.account === owner){
        this.setState({isOwner : true});
      }
      
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

    if(!this.state.isOwner){
      return(
        <div>
          ONLY OWNER CAN ACCESS
        </div>
      );
    }
    return (
      <div className="App">
        {/* <div>{this.state.owner}</div> */}
        {/* <p>Account address - {this.state.account}</p> */}
        <h2>Add Candidate</h2>

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
            <p>Enter Party Name - </p>
            <FormControl
                input = 'textArea'
                value = {this.state.party}
                onChange={this.updateParty}
            />
          </div>
        </FormGroup>

        <FormGroup>
          <div>
            <p>Enter Manifesto - </p>
            <FormControl
                input = 'text'
                value = {this.state.manifesto}
                onChange={this.updateManifesto}
            />
          </div>
        </FormGroup>
        <br></br>
        <Button onClick={this.addCandidate}>
          Add
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

export default AddCandidate;
