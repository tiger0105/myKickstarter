import React, { Component } from "react";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign.js";

import { Card, Button, Table } from "semantic-ui-react";
import { Link } from "../../../routes";
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const summary = await campaign.methods.getSummary().call();

    // Fancy JS
    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );

    return { address, requests, contributorCount: summary[3], requestCount };
  }

  renderRow() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          contributorCount={this.props.contributorCount}
          address={this.props.address}
        />
      );
    });
  }

  render() {
    const { Cell, Row, Headercell, Body } = Table;
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}`}>
          <a>Back</a>
        </Link>
        <h3>Pending Requests</h3>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button
              primary
              icon="add circle"
              floated="right"
              style={{ marginBottom: 10 }}
              content="Add Request"
            />
          </a>
        </Link>
        <Table>
          <Row>
            <Cell>ID</Cell>
            <Cell>Description</Cell>
            <Cell>Amount</Cell>
            <Cell>Recipient</Cell>
            <Cell>Approval Count</Cell>
            <Cell>Approve</Cell>
            <Cell>Finalize</Cell>
          </Row>
          <Body>{this.renderRow()}</Body>
        </Table>
        <div>Found {this.props.requestCount} requests</div>
      </Layout>
    );
  }
}

export default RequestIndex;
