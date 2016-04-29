'use strict';

import React from 'react/';

import { Row, Col, Button, Glyphicon } from 'react-bootstrap/lib/';

import Scroll from 'react-scroll';

import AssetActions from '../actions/asset_actions';

import AscribeSpinner from '../spinner';


const Assets = React.createClass({

    propTypes: {
        assetList: React.PropTypes.array,
        activeAccount: React.PropTypes.object
    },

    getInitialState: function() {
        return { value: null };
    },

    postAsset(payload) {
        AssetActions.postAsset(payload);
    },

    handleInputSubmit(event){
        event.preventDefault();
        const { activeAccount } = this.props;
        const { value } = this.state;
        const payload = {
            to: activeAccount.vk,
            content: value
        };
        this.postAsset(payload);
        this.setState({ value: null });
        Scroll.animateScroll.scrollToBottom();
    },

    handleInputChange(event) {
        this.setState({ value: event.target.value });
    },

    render() {
        const { assetList } = this.props;
        const { value } = this.state;

        return (
            <div>
                <AssetHistory assetList={ assetList }/>
                <form onSubmit={ this.handleInputSubmit }>
                    <input
                        className="navbar-fixed-bottom"
                        autoFocus placeholder="Type what you want to share on the blockchain"
                        value={ value }
                        onChange={ this.handleInputChange }/>
                </form>
            </div>
        );
    }
});


const AssetHistory = React.createClass({
    propTypes: {
        assetList: React.PropTypes.array
    },

    render() {
        const { assetList } = this.props;

        if ( assetList && assetList.length > 0 ) {

            return (
                <div>
                    {
                        assetList.sort((a, b) => a.transaction.timestamp - b.transaction.timestamp)
                            .map(asset => {
                            return (
                                <AssetRow
                                    key={ asset.id }
                                    asset={ asset }/>
                            );
                        })
                    }
                </div>
            );
        }
        else if ( assetList && assetList.length == 0 ) {

            return (
                <div className='content-text'>
                    No messages found on BigchainDB. Start typing...
                </div>
            );
        }

        return (
            <div style={{margin: '2em'}}>
                <AscribeSpinner />
            </div>
        );
    }
});


const AssetRow = React.createClass({

    propTypes: {
        asset: React.PropTypes.object
    },


    render() {
        const { asset } = this.props;

        return (
            <Row>
                <div className='asset-container pull-right'>
                    <div className='asset-container-id'>
                        id: { asset.id }
                    </div>
                    <div className='asset-container-detail'>
                        { asset.transaction.data ?
                            asset.transaction.data.payload.content :
                            '-'
                        }
                    </div>
                    <div className='asset-container-timestamp pull-right'>
                        timestamp: { asset.transaction.timestamp }
                    </div>
                </div>
            </Row>
        );
    }
});

export default Assets;
