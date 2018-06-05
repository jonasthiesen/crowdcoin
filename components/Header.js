import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
    return (
        <Menu style={ {borderRadius: '0'} }>
            <Link route="/">
                <a className="item">
                    CrowdCoin
                </a>
            </Link>
            <Menu.Menu position="right">
                <Menu.Item>
                    Campaigns
                </Menu.Item>
                <Link route="/campaigns/new">
                <a className="item">
                    +
                </a>
                </Link>
            </Menu.Menu>
        </Menu>
    );
};