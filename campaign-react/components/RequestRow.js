import React, { Component } from "react";
import { Table, Button, Message } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign.js";

import { Router } from "../routes";

class RequestRow extends Component {
  state = {
    loadingA: false,
    loadingF: false,
    errorMessage: ""
  };

  onApprove = async () => {
    this.setState({ loadingA: true, errorMessage: "" });
    const campaign = Campaign(this.props.address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .approveRequest(this.props.id)
        .send({ from: accounts[0] });
      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loadingA: false, errorMessage: "" });
  };

  onFinalize = async () => {
    this.setState({ loadingF: true, errorMessage: "" });
    const campaign = Campaign(this.props.address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .finalizeRequest(this.props.id)
        .send({ from: accounts[0] });
      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loadingF: false, errorMessage: "" });
  };

  render() {
    const { Row, Cell } = Table;
    const {
      address,
      description,
      recipient,
      value,
      complete,
      approvalCount
    } = this.props.request;
    const readyToFinalize = approvalCount > this.props.contributorCount / 2;

    return (
      <Row disabled={complete} positive={readyToFinalize && !complete}>
        <Cell>{this.props.id}</Cell>
        <Cell>{description}</Cell>
        <Cell>{web3.utils.fromWei(value, "ether")}</Cell>
        <Cell>{recipient}</Cell>
        <Cell>{`${approvalCount}/${this.props.contributorCount}`}</Cell>
        <Cell>
          {complete ? null : (
            <Button
              color="green"
              basic
              loading={this.state.loadingA}
              onClick={this.onApprove}
            >
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {complete ? null : (
            <Button
              color="blue"
              basic
              loading={this.state.loadingF}
              onClick={this.onFinalize}
            >
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
