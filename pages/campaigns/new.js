import React, { Component } from 'react';
import Layout from '../../components/Layout.js';
import { Form, Input, Button, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class CampaignNew extends Component {
    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({loading: true, errorMessage: ''});

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(
                this.state.minimumContribution
            ).send({
                from: accounts[0]
            });

            Router.pushRoute('/');
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }

        this.setState({loading: false});
    };

    render() {
        return (
            <Layout>
                <h3>Create a campaign</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label htmlFor="min-contribution">Minimum Contribution</label>
                        <Input
                            id="min-contribution"
                            type="text"
                            label="wei"
                            labelPosition="right"
                            values={this.state.minimumContribution}
                            onChange={event =>
                                this.setState({ minimumContribution: event.target.value })
                            }
                        />
                    </Form.Field>
                    <Message
                        error
                        header="Oops!"
                        content={this.state.errorMessage}
                    />
                    <Button loading={this.state.loading} primary>Create</Button>
                </Form>
            </Layout>
        );
    }
}

export default CampaignNew;