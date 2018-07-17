import React, { Component } from 'react';
import { Segment, Header, Icon, Container, Button, Menu, Checkbox } from 'semantic-ui-react'
import { ToastContainer } from 'react-toastify';

import { PlaceholderList } from '../../components';

import './index.css'

export class Dashboard extends Component {

  state = {
    isFormVisible: false,
  }
  
  render() {
    
    const { header, data, form, isFormVisible } = this.props;
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
            onClick={this.props.onToogleFormVisible}
          />
        </Header>
        <div className="content">
          <div className={isFormVisible? 'hidden-mobile' : ''}>
            <Menu attached="top">
              <Menu.Item>
                <Checkbox toggle label="Only active?"/>
              </Menu.Item>
            </Menu>
            <Segment>
              {data.isReady? data.component : <PlaceholderList length={6}/>}
            </Segment>
          </div>
          <div className={!isFormVisible? 'hidden-mobile' : ''} >
              {form.component}
          </div>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
      </Container>
    );
  }
}
