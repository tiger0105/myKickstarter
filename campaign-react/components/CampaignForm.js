// Campaign Form
// takes in required data from user for Campaign::createRequest(string,string uint) method call
import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";

import hq from "../ethereum/hq";
import web3 from "../ethereum/web3";

import { Router } from "../routes";

class CampaignForm extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    loading: false,
    quorum: "",
    fundingGoal: "",
    fundingDeadline: ""
  };

  onSubmit = async () => {
    // Browser will try to automatically submit form
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await hq.methods
        .createCampaign(
          this.state.minimumContribution,
          this.state.quorum,
          this.state.fundingGoal,
          this.state.fundingDeadline
        )
        .send({ from: accounts[0] });
      Router.pushRoute("/"); // Redirect user to root route (home page)
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({
      loading: false,
      minimumContribution: "",
      quorum: "",
      fundingGoal: "",
      fundingDeadline: ""
    });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            labelPosition="right"
            label="wei"
            value={this.state.minimumContribution}
            placeholder="Please specify the minimum donation to be considered a contributor"
            onChange={event =>
              this.setState({ minimumContribution: event.target.value })
            }
          />
        </Form.Field>
        <Form.Field>
          <label>Funding Goal</label>
          <Input
            value={this.state.fundingGoal}
            labelPosition="right"
            label="wei"
            placeholder="Please enter a funding target"
            onChange={event =>
              this.setState({ fundingGoal: event.target.value })
            }
          />
        </Form.Field>
        <Form.Field>
          <label>Funding Deadline</label>
          <Input
            value={this.state.fundingDeadline}
            placeholder="MM/DD/YYYY"
            onChange={event =>
              this.setState({ fundingDeadline: event.target.value })
            }
          />
        </Form.Field>
        <Form.Field>
          <label>Quorum</label>
          <Input
            value={this.state.quorum}
            placeholder="Please enter a number between 1 and 100"
            onChange={event => this.setState({ quorum: event.target.value })}
          />
        </Form.Field>
        <Message error header={"Oops!"} content={this.state.errorMessage} />
        <Button primary loading={this.state.loading}>
          Create Campaign!
        </Button>
      </Form>
    );
  }
}

export default CampaignForm;
