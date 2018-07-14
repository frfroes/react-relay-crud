import React, { Component } from 'react';

import { Segment, Header, Icon, Container, Button } from 'semantic-ui-react'

import { PlaceholderList } from '../../components';

import './index.css'

export class Dashboard extends Component {

  state = {
    isFormVisible: false,
  }

  _toogleFormVisible = () => {
    this.setState({
      isFormVisible: !this.state.isFormVisible
    })
  }
  
  render() {
    
    const { header, data, form } = this.props;
    const { isFormVisible } = this.state;
    const arrowPosition = isFormVisible ? 'left' : 'right';

    return (
      <Container className="dashboard">
        <Header as="h2">
          <Icon name={header.icon} />
          <Header.Content>{header.label}</Header.Content>
          <Button 
            primary 
            basic 
            size="small" 
            content={isFormVisible? `${header.label} list` : `Create ${header.label}`}
            icon={`${arrowPosition} arrow`} labelPosition={arrowPosition}
            onClick={this._toogleFormVisible}
          />
        </Header>
        <div className="content">
          <div className={isFormVisible? 'hidden-mobile' : ''}>
            <Segment>
              {data.isReady? data.component : <PlaceholderList length={3}/>}
            </Segment>
          </div>
          <div className={!isFormVisible? 'hidden-mobile' : ''} >
              {form.component}
          </div>
        </div>
      </Container>
    );
  }
}
