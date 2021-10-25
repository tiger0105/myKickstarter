// Withdraw Funds From Campaign
import React, { Component } from "react";
import { Button, Message, Form } from "semantic-ui-react";

import Campaign from "../ethereum/campaign.js";
import web3 from "../ethereum/web3";

import { Router } from "../routes";

class Withdraw extends Component {
  state = {
    errorMessage: "",
    loading: false
  };

  withDrawHandler = async () => {
    console.log("HANDLING");
    console.log("address:", this.props.address);
    const accounts = await web3.eth.getAccounts();
    const campaign = Campaign(this.props.address);
    this.setState({ loading: true, errorMessage: "" });

    try {
      await campaign.methods.withdraw().send({ from: accounts[0] });
      Router.replaceRoute(`/campaigns/${this.props.address}`); // Refresh the page to rerender component
    } catch (err) {
      console.log(err);
      this.setState({ errorMessage: err.message });
    }
    this.setState({
      loading: false,
      minimumContribution: ""
    });
  };

  render() {
    return (
      <Form error={!!this.state.errorMessage}>
        <Message
          style={{ marginTop: "20px" }}
          error
          header={"Oops!"}
          content={this.state.errorMessage}
        />
        <Button
          color="red"
          loading={this.state.loading}
          style={{ marginTop: "20px" }}
          onClick={this.withDrawHandler}
        >
          Withdraw Donation
        </Button>
      </Form>
    );
  }
}

export default Withdraw;
