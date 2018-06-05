import React, { Component } from 'react';
import Layout from '../../components/Layout';
import getCampaign from '../../ethereum/campaign';
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class CampaignShow extends Component {
    static async getInitialProps(props) {
        const campaign = getCampaign(props.query.address);

        const summary = await campaign.methods.getSummary().call();
        
        return {
            address: props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };
    }

    renderCards() {
        const {
            minimumContribution,
            balance,
            requestsCount,
            approversCount,
            manager
        } = this.props;

        const items = [
            {
                header: minimumContribution,
                meta: 'Minimum Contribution',
                description: 'The minimum amount of wei you have to contribute to be considered an approver'
            },
            {
                header: 'Ξ' + web3.utils.fromWei(balance, 'ether'),
                meta: 'Balance',
                description: 'The amount of ether a campaign has'
            },
            {
                header: requestsCount,
                meta: 'Amount of Requests',
                description: 'The amount of requests that campaign has'
            },
            {
                header: approversCount,
                meta: 'Approvers',
                description: 'The amount of people that have backed this campaign and have become approvers'
            },
            {
                header: manager,
                meta: 'Manager',
                description: 'The address of the manager that created the campaign',
                style: { overflowWrap: 'break-word' }
            }
        ];

        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <h3>Campaign to show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address}></ContributeForm>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <Button primary>View Requests</Button>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default CampaignShow;