import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import getCampaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class ContributeForm extends Component {
    state = {
        value: '',
        loading: false,
        errorMessage: ''
    };

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        const campaign = getCampaign(this.props.address);

        try {
            const accounts = await web3.eth.getAccounts();

            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });

            Router.replaceRoute(`/campaigns/${this.props.address}`);
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }

        this.setState({ loading: false });
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label htmlFor="contribution">Contribution</label>
                    <Input
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value })}
                        id="contribution"
                        label="ether"
                        labelPosition="right"
                    />
                </Form.Field>
                <Message
                    error
                    header="Oops!"
                    content={this.state.errorMessage}
                />
                <Button primary loading={!!this.state.loading}>
                    Contribute
                </Button>
            </Form>
        );
    }
}

export default ContributeForm;