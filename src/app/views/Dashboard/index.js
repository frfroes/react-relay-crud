import React, { Component } from 'react';

import { Segment, Header, Icon, Container, Button } from 'semantic-ui-react'

import { PlaceholderList } from '../../components';

import './index.css'

export class Dashboard extends Component {
  
  render() {
    
    const { header, data, form } = this.props;

    return (
      <Container className="dashboard">
        <Header as="h2">
          <Icon name={header.icon} />
          <Header.Content>{header.label}</Header.Content>
          <Button 
            primary 
            basic 
            size="small" 
            content={`Create ${header.label}`}
            icon='right arrow' labelPosition='right'
          />
        </Header>
        <div className="content">
          <div>
            <Segment>
              {data.isReady? data.component : <PlaceholderList length={3}/>}
            </Segment>
          </div>
          <div>
              {form.component}
          </div>
        </div>
      </Container>
    );
  }
}
