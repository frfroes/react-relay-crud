import React from 'react';
import Relay, { graphql } from 'react-relay';

import { Card } from 'semantic-ui-react'

import './index.css'

export class PlaceholderList extends React.Component {
  
    _repeatFakeCard(){
       const FakeCard = (key) => (  
            <Card key={key}>
                <Card.Content>
                    <div className="animated-background">
                        <div className="background-masker header-top"></div>
                        <div className="background-masker header-left"></div>
                        <div className="background-masker header-right"></div>
                        <div className="background-masker header-bottom"></div>
                        <div className="background-masker subheader-left"></div>
                        <div className="background-masker subheader-right"></div>
                        <div className="background-masker subheader-bottom"></div>
                        <div className="background-masker content-top"></div>
                        <div className="background-masker content-first-end"></div>
                        <div className="background-masker content-second-line"></div>
                        <div className="background-masker content-second-end"></div>
                        <div className="background-masker content-third-line"></div>
                        <div className="background-masker content-third-end"></div>
                    </div>
                </Card.Content>
            </Card>
        )

        return new Array(this.props.length).fill().map((_, i) =>  <FakeCard key={i}/>);
    }
    
    render() {
        const { user } = this.props;

        return (
            <Card.Group itemsPerRow={2} stackable>
                {this._repeatFakeCard()}
            </Card.Group>
        );
    }
}